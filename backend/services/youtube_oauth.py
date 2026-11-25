import os
import time
import secrets
import threading
import datetime
from typing import Optional, Tuple, Dict, Any
from pathlib import Path
import requests

from google.oauth2.credentials import Credentials
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload
from sqlalchemy.orm import Session

try:
    from backend.services.token_encryption import encrypt_token, decrypt_token
    from backend.database.models import ConnectedAccount
except ImportError:
    from services.token_encryption import encrypt_token, decrypt_token
    from database.models import ConnectedAccount

# OAuth 2.0 Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8000/api/youtube/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

YOUTUBE_SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload"
]

# Thread-safe in-memory state store for CSRF protection
_STATE_LOCK = threading.Lock()
_OAUTH_STATES: Dict[str, Dict[str, Any]] = {}

def is_google_configured() -> bool:
    """Checks whether valid Google OAuth credentials have been set in environment."""
    return bool(
        GOOGLE_CLIENT_ID and 
        GOOGLE_CLIENT_SECRET and 
        not GOOGLE_CLIENT_ID.startswith("your_") and 
        not GOOGLE_CLIENT_SECRET.startswith("your_")
    )

def create_oauth_state(user_id: str) -> str:
    """Generates an expiring, single-use OAuth state associated with an authenticated user."""
    state = secrets.token_urlsafe(32)
    with _STATE_LOCK:
        # Clean up states older than 15 minutes
        now = time.time()
        expired_keys = [k for k, v in _OAUTH_STATES.items() if now - v["created_at"] > 900]
        for k in expired_keys:
            _OAUTH_STATES.pop(k, None)
            
        _OAUTH_STATES[state] = {
            "user_id": user_id,
            "created_at": now
        }
    return state

def validate_and_consume_oauth_state(state: str) -> Optional[str]:
    """Validates and immediately deletes state. Returns associated user_id if valid, else None."""
    with _STATE_LOCK:
        entry = _OAUTH_STATES.pop(state, None)
        if not entry:
            return None
        if time.time() - entry["created_at"] > 900: # 15 minutes timeout
            return None
        return entry["user_id"]

def generate_authorization_url(user_id: str) -> Tuple[str, str]:
    """Builds the Google OAuth 2.0 Authorization URL for YouTube permissions."""
    state = create_oauth_state(user_id)
    
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(YOUTUBE_SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "include_granted_scopes": "true",
        "state": state
    }
    
    query = "&".join(f"{k}={requests.utils.quote(str(v))}" for k, v in params.items())
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{query}"
    return auth_url, state

def exchange_code_for_tokens(code: str) -> Dict[str, Any]:
    """Exchanges Google authorization code for access and refresh tokens."""
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    res = requests.post(token_url, data=data, timeout=15)
    if not res.ok:
        raise Exception(f"Google Token Exchange Failed ({res.status_code}): {res.text}")
    return res.json()

def refresh_google_access_token(encrypted_refresh_token: str) -> Dict[str, Any]:
    """Refreshes an expired Google access token using the encrypted refresh token."""
    refresh_token = decrypt_token(encrypted_refresh_token)
    if not refresh_token:
        raise Exception("Decryption failed: Missing or invalid refresh token.")
        
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }
    res = requests.post(token_url, data=data, timeout=15)
    if not res.ok:
        raise Exception(f"Google Token Refresh Failed: {res.text}")
    return res.json()

def fetch_channel_details(access_token: str) -> Dict[str, Any]:
    """Fetches YouTube Channel details for the authenticated user."""
    url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true"
    headers = {"Authorization": f"Bearer {access_token}"}
    res = requests.get(url, headers=headers, timeout=15)
    if not res.ok:
        raise Exception(f"Failed to fetch YouTube channel: {res.text}")
    
    data = res.json()
    items = data.get("items", [])
    if not items:
        # User has a Google account but hasn't created a YouTube channel yet
        return {
            "channel_id": "UC_NEW_CHANNEL",
            "channel_title": "My YouTube Channel",
            "channel_handle": "",
            "channel_thumbnail": "",
            "subscriber_count": 0
        }
        
    item = items[0]
    snippet = item.get("snippet", {})
    statistics = item.get("statistics", {})
    thumbnails = snippet.get("thumbnails", {})
    thumb_url = thumbnails.get("medium", {}).get("url") or thumbnails.get("default", {}).get("url") or ""
    
    return {
        "channel_id": item.get("id", ""),
        "channel_title": snippet.get("title", "YouTube Channel"),
        "channel_handle": snippet.get("customUrl", ""),
        "channel_thumbnail": thumb_url,
        "subscriber_count": int(statistics.get("subscriberCount", 0))
    }

def get_valid_youtube_service(account: ConnectedAccount, db: Session):
    """Returns an authenticated YouTube API client, refreshing the access token if needed."""
    now = datetime.datetime.utcnow()
    access_token = account.access_token
    
    # Check if access token is expired or will expire in less than 60 seconds
    needs_refresh = (
        not access_token or 
        not account.token_expiry or 
        account.token_expiry <= now + datetime.timedelta(seconds=60)
    )
    
    decrypted_refresh_token = decrypt_token(account.encrypted_refresh_token) if account.encrypted_refresh_token else None

    if needs_refresh and account.encrypted_refresh_token:
        try:
            refreshed = refresh_google_access_token(account.encrypted_refresh_token)
            access_token = refreshed.get("access_token")
            expires_in = int(refreshed.get("expires_in", 3600))
            account.access_token = access_token
            account.token_expiry = now + datetime.timedelta(seconds=expires_in)
            account.updated_at = now
            db.commit()
        except Exception as e:
            # If refresh fails, try using existing access_token if present
            if not access_token:
                raise Exception(f"YouTube credentials expired and refresh failed: {str(e)}")

    creds = Credentials(
        token=access_token,
        refresh_token=decrypted_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=YOUTUBE_SCOPES
    )
    return googleapiclient.discovery.build("youtube", "v3", credentials=creds)

def revoke_google_token(account: ConnectedAccount) -> bool:
    """Revokes token access from Google servers."""
    token_to_revoke = None
    if account.encrypted_refresh_token:
        try:
            token_to_revoke = decrypt_token(account.encrypted_refresh_token)
        except Exception:
            pass
    if not token_to_revoke and account.access_token:
        token_to_revoke = account.access_token
        
    if token_to_revoke:
        try:
            res = requests.post(
                f"https://oauth2.googleapis.com/revoke?token={token_to_revoke}",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10
            )
            return res.ok
        except Exception:
            pass
    return False

def upload_clip_to_youtube(
    account: ConnectedAccount,
    file_path: str,
    title: str,
    description: str,
    tags: list,
    privacy_status: str,
    db: Session
) -> Dict[str, Any]:
    """Uploads an existing local MP4 clip to the user's connected YouTube channel."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Clip file not found on disk: {file_path}")

    # Build authenticated client
    youtube = get_valid_youtube_service(account, db)

    # Sanitize inputs for YouTube API requirements
    safe_title = (title or "Viral Clip #Shorts").strip()[:100]
    safe_description = (description or "Created with TM Cliper AI #Shorts").strip()[:5000]
    safe_privacy = privacy_status.lower() if privacy_status.lower() in ["public", "unlisted", "private"] else "public"
    
    if isinstance(tags, str):
        safe_tags = [t.strip() for t in tags.split(",") if t.strip()]
    elif isinstance(tags, list):
        safe_tags = [str(t).strip() for t in tags if str(t).strip()]
    else:
        safe_tags = ["shorts", "viral", "tmcliper"]

    body = {
        "snippet": {
            "title": safe_title,
            "description": safe_description,
            "tags": safe_tags[:50],
            "categoryId": "22" # People & Blogs
        },
        "status": {
            "privacyStatus": safe_privacy,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(
        file_path,
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 5 # 5MB chunk
    )

    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()

    video_id = response.get("id")
    if not video_id:
        raise Exception("YouTube did not return a video ID upon upload.")

    return {
        "status": "success",
        "youtube_video_id": video_id,
        "youtube_url": f"https://www.youtube.com/shorts/{video_id}",
        "channel_id": account.channel_id,
        "title": safe_title,
        "privacy": safe_privacy
    }
