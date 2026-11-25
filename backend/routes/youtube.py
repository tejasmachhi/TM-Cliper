import os
import uuid
import datetime
from pathlib import Path
from typing import Optional, List, Any
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Query, Header
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

try:
    from backend.database.session import get_db, STORAGE_DIR, BASE_DIR
    from backend.database.models import User, ConnectedAccount, Clip
    from backend.core.auth import get_user_from_token, get_or_create_default_user
    from backend.services.token_encryption import encrypt_token
    from backend.services.youtube_oauth import (
        is_google_configured,
        generate_authorization_url,
        validate_and_consume_oauth_state,
        exchange_code_for_tokens,
        fetch_channel_details,
        revoke_google_token,
        upload_clip_to_youtube,
        FRONTEND_URL
    )
except ImportError:
    from database.session import get_db, STORAGE_DIR, BASE_DIR
    from database.models import User, ConnectedAccount, Clip
    from core.auth import get_user_from_token, get_or_create_default_user
    from services.token_encryption import encrypt_token
    from services.youtube_oauth import (
        is_google_configured,
        generate_authorization_url,
        validate_and_consume_oauth_state,
        exchange_code_for_tokens,
        fetch_channel_details,
        revoke_google_token,
        upload_clip_to_youtube,
        FRONTEND_URL
    )

router = APIRouter()

# Dependency to get authenticated user
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    user = get_user_from_token(token, db)
    if not user:
        user = get_or_create_default_user(db)
    return user

# Schemas
class YouTubePreferencesRequest(BaseModel):
    default_title: Optional[str] = None
    default_description: Optional[str] = None
    default_tags: Optional[str] = None
    default_privacy: Optional[str] = "public"

class UploadClipRequest(BaseModel):
    clip_id: str
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[Any] = None
    privacy_status: Optional[str] = "public"
    upload_type: Optional[str] = "shorts"

# ----------------- 1. START CONNECTION -----------------
@router.get("/connect")
def start_youtube_connection(user: User = Depends(get_current_user)):
    """Initiates Google OAuth 2.0 flow for YouTube access."""
    if not is_google_configured():
        return {
            "status": "unconfigured",
            "message": "Google Client ID and Secret are not yet configured in backend .env.",
            "auth_url": None,
            "instructions": "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env to enable live OAuth."
        }

    auth_url, state = generate_authorization_url(user.id)
    return {
        "status": "success",
        "auth_url": auth_url,
        "state": state
    }

# ----------------- 2. OAUTH CALLBACK -----------------
@router.get("/callback")
def youtube_oauth_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Handles redirect from Google after user approves or denies permissions."""
    settings_url = f"{FRONTEND_URL}/settings?tab=accounts"

    if error:
        return RedirectResponse(url=f"{settings_url}&status=error&message={quote(error)}")

    if not code or not state:
        return RedirectResponse(url=f"{settings_url}&status=error&message=Missing+code+or+state")

    # Validate state and retrieve associated user_id
    user_id = validate_and_consume_oauth_state(state)
    if not user_id:
        return RedirectResponse(url=f"{settings_url}&status=error&message=Invalid+or+expired+OAuth+session")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return RedirectResponse(url=f"{settings_url}&status=error&message=User+not+found")

    try:
        # Exchange authorization code for tokens
        token_data = exchange_code_for_tokens(code)
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        expires_in = int(token_data.get("expires_in", 3600))
        granted_scopes = token_data.get("scope", "")

        # Fetch channel details from YouTube Data API v3
        channel_info = fetch_channel_details(access_token)

        # Look up existing connected account or create new one
        account = db.query(ConnectedAccount).filter(
            ConnectedAccount.user_id == user.id,
            ConnectedAccount.provider == "youtube"
        ).first()

        now = datetime.datetime.utcnow()
        expiry_dt = now + datetime.timedelta(seconds=expires_in)

        if not account:
            account = ConnectedAccount(
                id=f"ca-{uuid.uuid4().hex[:12]}",
                user_id=user.id,
                provider="youtube",
                channel_id=channel_info.get("channel_id"),
                channel_title=channel_info.get("channel_title"),
                channel_handle=channel_info.get("channel_handle"),
                channel_thumbnail=channel_info.get("channel_thumbnail"),
                subscriber_count=channel_info.get("subscriber_count", 0),
                encrypted_refresh_token=encrypt_token(refresh_token) if refresh_token else None,
                access_token=access_token,
                token_expiry=expiry_dt,
                granted_scopes=granted_scopes,
                connected_at=now,
                updated_at=now
            )
            db.add(account)
        else:
            account.channel_id = channel_info.get("channel_id")
            account.channel_title = channel_info.get("channel_title")
            account.channel_handle = channel_info.get("channel_handle")
            account.channel_thumbnail = channel_info.get("channel_thumbnail")
            account.subscriber_count = channel_info.get("subscriber_count", 0)
            account.access_token = access_token
            account.token_expiry = expiry_dt
            account.granted_scopes = granted_scopes
            account.updated_at = now
            if refresh_token:
                account.encrypted_refresh_token = encrypt_token(refresh_token)

        db.commit()

        return RedirectResponse(
            url=f"{settings_url}&status=connected&channel={quote(account.channel_title or 'YouTube')}"
        )

    except Exception as e:
        return RedirectResponse(url=f"{settings_url}&status=error&message={quote(str(e))}")

# ----------------- 3. CONNECTION STATUS -----------------
@router.get("/status")
def get_youtube_status(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns the authenticated user's YouTube connection status."""
    configured = is_google_configured()
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()

    if not account:
        return {
            "status": "success",
            "connected": False,
            "configured": configured,
            "account": None
        }

    return {
        "status": "success",
        "connected": True,
        "configured": configured,
        "account": {
            "id": account.id,
            "provider": account.provider,
            "channel_id": account.channel_id,
            "channel_title": account.channel_title,
            "channel_handle": account.channel_handle,
            "channel_thumbnail": account.channel_thumbnail,
            "subscriber_count": account.subscriber_count,
            "granted_scopes": account.granted_scopes,
            "default_privacy": account.default_privacy,
            "default_title": account.default_title,
            "default_description": account.default_description,
            "default_tags": account.default_tags,
            "connected_at": account.connected_at.isoformat() if account.connected_at else None
        }
    }

# ----------------- 4. FETCH CHANNEL DETAILS -----------------
@router.get("/channel")
def get_youtube_channel(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns channel details for the authenticated user's linked account."""
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="No YouTube channel connected for this account.")

    return {
        "status": "success",
        "channel": {
            "channel_id": account.channel_id,
            "channel_title": account.channel_title,
            "channel_handle": account.channel_handle,
            "channel_thumbnail": account.channel_thumbnail,
            "subscriber_count": account.subscriber_count,
            "default_privacy": account.default_privacy,
            "default_title": account.default_title,
            "default_description": account.default_description,
            "default_tags": account.default_tags
        }
    }

# ----------------- 5. DISCONNECT ACCOUNT -----------------
@router.delete("/disconnect")
def disconnect_youtube_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Revokes Google authorization and deletes the stored account credentials."""
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()

    if not account:
        return {"status": "success", "message": "No account was connected."}

    # Revoke on Google servers
    revoke_google_token(account)

    # Delete database record
    db.delete(account)
    db.commit()

    return {"status": "success", "message": "YouTube account successfully disconnected."}

# ----------------- 6. UPDATE PREFERENCES -----------------
@router.post("/preferences")
def update_youtube_preferences(
    req: YouTubePreferencesRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates default publishing preferences for the user's YouTube uploads."""
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Connect your YouTube channel first.")

    if req.default_title is not None:
        account.default_title = req.default_title
    if req.default_description is not None:
        account.default_description = req.default_description
    if req.default_tags is not None:
        account.default_tags = req.default_tags
    if req.default_privacy is not None:
        account.default_privacy = req.default_privacy

    account.updated_at = datetime.datetime.utcnow()
    db.commit()

    return {"status": "success", "message": "Preferences updated."}

# ----------------- 7. UPLOAD GENERATED CLIP -----------------
@router.post("/upload")
def upload_clip(
    req: UploadClipRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uploads an existing rendered clip to the authenticated user's YouTube channel."""
    # 1. Enforce user ownership of the clip
    clip = db.query(Clip).filter(Clip.id == req.clip_id, Clip.user_id == user.id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found or unauthorized access.")

    # 2. Check connected YouTube account
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()
    if not account:
        raise HTTPException(
            status_code=400,
            detail="No YouTube account connected. Please connect your channel in Settings -> Connected Accounts."
        )

    # 3. Locate clip video file safely
    candidate_paths = []
    if clip.file_path:
        candidate_paths.append(BASE_DIR / clip.file_path)
        candidate_paths.append(STORAGE_DIR / clip.file_path)
        candidate_paths.append(STORAGE_DIR / "clips" / os.path.basename(clip.file_path))

    target_file = None
    for cp in candidate_paths:
        if os.path.exists(cp) and os.path.isfile(cp):
            target_file = str(cp)
            break

    if not target_file:
        raise HTTPException(status_code=404, detail="Rendered clip video file was not found on server disk.")

    upload_type = req.upload_type or "shorts"
    title = req.title or clip.title or account.default_title or "Viral Clip"
    if upload_type == "shorts" and "#Shorts" not in title and "#shorts" not in title:
        title = f"{title} #Shorts"

    description = req.description or clip.description or account.default_description or "Generated with TM Cliper AI"
    if upload_type == "shorts" and "#Shorts" not in description and "#shorts" not in description:
        description = f"{description}\n\n#Shorts #viral #trending"

    tags = req.tags or account.default_tags or ["shorts", "viral", "tmcliper"]
    privacy = req.privacy_status or account.default_privacy or "public"

    try:
        result = upload_clip_to_youtube(
            account=account,
            file_path=target_file,
            title=title,
            description=description,
            tags=tags,
            privacy_status=privacy,
            db=db
        )
        vid = result.get("youtube_video_id")
        result["upload_type"] = upload_type
        if upload_type == "shorts":
            result["youtube_url"] = f"https://www.youtube.com/shorts/{vid}"
        else:
            result["youtube_url"] = f"https://www.youtube.com/watch?v={vid}"
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"YouTube upload failed: {str(e)}")

# ----------------- BACKWARD COMPATIBILITY ALIASES -----------------
@router.get("/integration")
def get_integration_alias(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    account = db.query(ConnectedAccount).filter(
        ConnectedAccount.user_id == user.id,
        ConnectedAccount.provider == "youtube"
    ).first()
    if not account:
        return {
            "status": "success",
            "integration": {
                "connected": False,
                "channel_title": "",
                "channel_id": "",
                "subscriber_count": 0,
                "default_privacy": "public",
                "default_title": "{{clip_title}} #Shorts",
                "default_tags": "shorts, viral, tmcliper",
                "default_description": "Generated with TM Cliper AI."
            }
        }
    return {
        "status": "success",
        "integration": {
            "connected": True,
            "channel_title": account.channel_title,
            "channel_id": account.channel_id,
            "channel_handle": account.channel_handle,
            "channel_thumbnail": account.channel_thumbnail,
            "subscriber_count": account.subscriber_count,
            "default_privacy": account.default_privacy,
            "default_title": account.default_title,
            "default_tags": account.default_tags,
            "default_description": account.default_description
        }
    }

@router.post("/integration/connect")
def connect_integration_alias(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return start_youtube_connection(user=user)

@router.post("/integration/disconnect")
def disconnect_integration_alias(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return disconnect_youtube_account(user=user, db=db)

@router.post("/integration/preferences")
def preferences_integration_alias(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    req = YouTubePreferencesRequest(
        default_title=data.get("default_title"),
        default_description=data.get("default_description"),
        default_tags=data.get("default_tags"),
        default_privacy=data.get("default_privacy")
    )
    return update_youtube_preferences(req=req, user=user, db=db)

@router.post("/integration/publish")
def publish_integration_alias(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    req = UploadClipRequest(
        clip_id=data.get("clip_id"),
        title=data.get("title"),
        description=data.get("description"),
        tags=data.get("tags"),
        privacy_status=data.get("privacy_status", "public"),
        upload_type=data.get("upload_type", "shorts")
    )
    return upload_clip(req=req, user=user, db=db)
