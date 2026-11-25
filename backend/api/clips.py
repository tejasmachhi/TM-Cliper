import os
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import get_db
from database.models import Clip

router = APIRouter(prefix="/clips", tags=["clips"])

@router.get("")
async def list_clips(
    game: str = Query(None),
    min_score: int = Query(0),
    limit: int = Query(50),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Clip).order_by(Clip.created_at.desc())
    if game and game != "ALL":
        stmt = stmt.where(Clip.game == game)
    if min_score > 0:
        stmt = stmt.where(Clip.score >= min_score)
    stmt = stmt.limit(limit)

    res = await db.execute(stmt)
    clips = res.scalars().all()

    return {
        "clips": [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "game": c.game,
                "score": c.score,
                "duration": round(c.duration, 1),
                "aspect_ratio": c.aspect_ratio,
                "event_type": c.event_type,
                "has_subtitles": c.has_subtitles,
                "uploaded": c.uploaded,
                "youtube_video_id": c.youtube_video_id,
                "created_at": c.created_at.strftime("%Y-%m-%d %H:%M") if c.created_at else "",
                "video_url": f"/api/clips/{c.id}/stream"
            }
            for c in clips
        ]
    }

@router.get("/{clip_id}")
async def get_clip(clip_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Clip).where(Clip.id == clip_id)
    res = await db.execute(stmt)
    c = res.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Clip not found")

    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "game": c.game,
        "score": c.score,
        "duration": c.duration,
        "aspect_ratio": c.aspect_ratio,
        "event_type": c.event_type,
        "has_subtitles": c.has_subtitles,
        "uploaded": c.uploaded,
        "youtube_video_id": c.youtube_video_id,
        "created_at": c.created_at.strftime("%Y-%m-%d %H:%M") if c.created_at else "",
        "video_url": f"/api/clips/{c.id}/stream"
    }

@router.get("/{clip_id}/stream")
async def stream_clip(clip_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Clip).where(Clip.id == clip_id)
    res = await db.execute(stmt)
    c = res.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Clip not found")

    if not os.path.exists(c.filepath):
        raise HTTPException(status_code=404, detail="Clip video file not found on disk")

    return FileResponse(c.filepath, media_type="video/mp4", filename=os.path.basename(c.filepath))

@router.delete("/{clip_id}")
async def delete_clip(clip_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Clip).where(Clip.id == clip_id)
    res = await db.execute(stmt)
    c = res.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Clip not found")

    if os.path.exists(c.filepath):
        try:
            os.remove(c.filepath)
        except Exception:
            pass

    await db.delete(c)
    await db.commit()
    return {"success": True, "deleted_id": clip_id}
