import os
import shutil
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import get_db
from database.models import Recording
from config import RECORDINGS_DIR

router = APIRouter(prefix="/recordings", tags=["recordings"])

@router.get("")
async def list_recordings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recording).order_by(Recording.created_at.desc()))
    recordings = result.scalars().all()
    return {
        "recordings": [
            {
                "id": r.id,
                "filename": r.filename,
                "filepath": r.filepath,
                "size_mb": round(r.size_mb, 2),
                "duration_sec": r.duration_sec,
                "game": r.game,
                "status": r.status,
                "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
            }
            for r in recordings
        ]
    }

@router.post("/scan")
async def scan_recordings(db: AsyncSession = Depends(get_db)):
    """Scans the storage/recordings folder for new MP4, MKV, MOV, AVI files."""
    valid_exts = {".mp4", ".mkv", ".mov", ".avi"}
    added = []

    if RECORDINGS_DIR.exists():
        for file in RECORDINGS_DIR.iterdir():
            if file.is_file() and file.suffix.lower() in valid_exts:
                # Check if exists in db
                stmt = select(Recording).where(Recording.filename == file.name)
                res = await db.execute(stmt)
                existing = res.scalar_one_or_none()
                if not existing:
                    size_mb = file.stat().st_size / (1024 * 1024)
                    rec = Recording(
                        id=f"rec-{uuid.uuid4().hex[:8]}",
                        filename=file.name,
                        filepath=str(file),
                        size_mb=size_mb,
                        duration_sec=0.0,
                        game="GTA V",
                        status="ready",
                    )
                    db.add(rec)
                    added.append(file.name)

        await db.commit()

    return {"scanned_count": len(added), "added": added}

@router.post("/import")
async def import_recording(
    file: UploadFile = File(...),
    game: str = Form("GTA V"),
    db: AsyncSession = Depends(get_db)
):
    valid_exts = {".mp4", ".mkv", ".mov", ".avi"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in valid_exts:
        raise HTTPException(status_code=400, detail="Unsupported video format. Allowed: MP4, MKV, MOV, AVI")

    rec_id = f"rec-{uuid.uuid4().hex[:8]}"
    save_path = RECORDINGS_DIR / file.filename
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    size_mb = save_path.stat().st_size / (1024 * 1024)

    recording = Recording(
        id=rec_id,
        filename=file.filename,
        filepath=str(save_path),
        size_mb=size_mb,
        duration_sec=0.0,
        game=game,
        status="ready"
    )
    db.add(recording)
    await db.commit()

    return {
        "success": True,
        "recording": {
            "id": recording.id,
            "filename": recording.filename,
            "filepath": recording.filepath,
            "size_mb": round(size_mb, 2),
            "duration_sec": 0.0,
            "game": recording.game,
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }
    }
