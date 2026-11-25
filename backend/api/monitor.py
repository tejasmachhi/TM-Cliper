import shutil
import uuid
import asyncio
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.db import get_db, AsyncSessionLocal
from database.models import Recording, Clip, JobQueue
from config import STORAGE_DIR
from engine.clip_generator import process_recording_pipeline

router = APIRouter(tags=["monitor_and_queue"])

class ProcessRequest(BaseModel):
    recording_id: str
    game: str = "GTA V"
    aspect_ratio: str = "9:16"
    min_score: int = 75
    target_duration: int = 30
    max_clips: int = 5
    burn_subtitles: bool = True
    sub_language: str = "auto"

async def run_pipeline_worker(job_id: str, recording_id: str, options: dict):
    async with AsyncSessionLocal() as session:
        await process_recording_pipeline(job_id, recording_id, session, options)

@router.get("/system/status")
async def get_system_status(db: AsyncSession = Depends(get_db)):
    # Total recordings
    rec_count = (await db.execute(select(func.count(Recording.id)))).scalar() or 0
    # Total clips
    clip_count = (await db.execute(select(func.count(Clip.id)))).scalar() or 0
    # Pending review (uploaded=False)
    pending_count = (await db.execute(select(func.count(Clip.id)).where(Clip.uploaded == False))).scalar() or 0
    # Uploaded
    uploaded_count = (await db.execute(select(func.count(Clip.id)).where(Clip.uploaded == True))).scalar() or 0

    # Calculate storage
    total_bytes = sum(f.stat().st_size for f in STORAGE_DIR.rglob('*') if f.is_file())
    storage_gb = round(total_bytes / (1024 ** 3), 2)

    return {
        "status": "online",
        "stats": {
            "recordings_count": rec_count,
            "clips_count": clip_count,
            "pending_review": pending_count,
            "uploaded_count": uploaded_count,
            "storage_used_gb": storage_gb,
        },
        "engine": "Local CUDA/CPU Engine",
        "gpu_detected": "NVIDIA GeForce RTX 3050 Laptop GPU",
    }

@router.get("/queue")
async def get_queue(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(JobQueue).order_by(JobQueue.created_at.desc()))
    jobs = res.scalars().all()
    return {
        "jobs": [
            {
                "id": j.id,
                "file_name": j.file_name,
                "game": j.game,
                "stage": j.stage,
                "progress": j.progress,
                "status": j.status,
            }
            for j in jobs
        ]
    }

@router.post("/queue/process")
async def queue_process_job(
    req: ProcessRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Recording).where(Recording.id == req.recording_id)
    res = await db.execute(stmt)
    rec = res.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")

    job_id = f"job-{uuid.uuid4().hex[:6]}"
    job = JobQueue(
        id=job_id,
        recording_id=rec.id,
        file_name=rec.filename,
        game=req.game,
        stage="Queued for AI Extraction",
        progress=0,
        status="queued"
    )
    db.add(job)
    await db.commit()

    options = {
        "game": req.game,
        "aspect_ratio": req.aspect_ratio,
        "min_score": req.min_score,
        "target_duration": req.target_duration,
        "max_clips": req.max_clips,
        "burn_subtitles": req.burn_subtitles,
        "sub_language": req.sub_language,
    }

    # Run background processing pipeline
    background_tasks.add_task(run_pipeline_worker, job_id, rec.id, options)

    return {"success": True, "job_id": job_id, "message": "Job successfully queued and background worker started"}

@router.get("/monitor/status")
async def get_monitor_status():
    return {
        "obs_folder_monitoring": True,
        "rolling_buffer": True,
        "active_triggers": 0,
        "recent_signals": {
            "audio_level": 74,
            "visual_motion": 52,
            "chat_velocity": 45
        }
    }
