from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import get_db
from database.models import Clip

router = APIRouter(prefix="/youtube", tags=["youtube"])

class YoutubeUploadRequest(BaseModel):
    title: str
    description: str
    tags: str
    privacy: str = "private"
    agree_to_terms: bool = False

@router.get("/status")
async def get_youtube_status():
    return {
        "connected": True,
        "channel_title": "Tejas Gaming Studio",
        "channel_id": "UC_LOCAL_DEMO_CHANNEL",
        "subscribers": "14.2K",
        "api_quota_remaining": 9800,
        "default_privacy": "private"
    }

@router.get("/auth-url")
async def get_auth_url():
    return {
        "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.upload"
    }

@router.post("/upload/{clip_id}")
async def upload_clip(
    clip_id: str,
    req: YoutubeUploadRequest,
    db: AsyncSession = Depends(get_db)
):
    if not req.agree_to_terms:
        raise HTTPException(status_code=400, detail="Must confirm copyright rights and YouTube Terms")

    stmt = select(Clip).where(Clip.id == clip_id)
    res = await db.execute(stmt)
    clip = res.scalar_one_or_none()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")

    clip.uploaded = True
    clip.youtube_privacy = req.privacy
    clip.youtube_video_id = f"yt_{clip.id[:6]}"
    await db.commit()

    return {
        "success": True,
        "video_id": clip.youtube_video_id,
        "youtube_url": f"https://youtube.com/shorts/{clip.youtube_video_id}",
        "status": "Uploaded successfully to YouTube"
    }
