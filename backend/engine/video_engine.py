import os
import re
import uuid
import json
import subprocess
import datetime
from pathlib import Path
import imageio_ffmpeg
import yt_dlp
try:
    from backend.database.session import BASE_DIR, STORAGE_DIR
except ImportError:
    from database.session import BASE_DIR, STORAGE_DIR

RECORDINGS_DIR = STORAGE_DIR / "recordings"
CLIPS_DIR = STORAGE_DIR / "clips"
THUMBNAILS_DIR = STORAGE_DIR / "thumbnails"

os.makedirs(RECORDINGS_DIR, exist_ok=True)
os.makedirs(CLIPS_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)

def get_ffmpeg_path():
    try:
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"

def sanitize_filename(name: str) -> str:
    return re.sub(r'[\\/*?:"<>| ]', '_', name)[:80]

def get_file_duration(filepath: str) -> int:
    try:
        ffmpeg_exe = get_ffmpeg_path()
        cmd = [ffmpeg_exe, "-i", filepath]
        res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL, text=True, errors='replace')
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)", res.stderr)
        if match:
            h, m, s = match.groups()
            return int(int(h) * 3600 + int(m) * 60 + float(s))
    except Exception as e:
        print(f"Error getting duration: {e}")
    return 60

def download_youtube_video(url: str, game: str = "General", progress_callback=None) -> dict:
    ffmpeg_exe = get_ffmpeg_path()
    
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'merge_output_format': 'mp4',
        'extractor_args': {'youtube': {'player_client': ['android', 'ios', 'web']}},
        'outtmpl': str(RECORDINGS_DIR / '%(title).60s_%(id)s.%(ext)s'),
        'ffmpeg_location': ffmpeg_exe,
        'noplaylist': True,
        'quiet': False,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        
        # Ensure file exists or search matching extension
        if not os.path.exists(filename):
            base_no_ext = os.path.splitext(filename)[0]
            for ext in ['.mp4', '.mkv', '.webm']:
                if os.path.exists(base_no_ext + ext):
                    filename = base_no_ext + ext
                    break

        file_size_mb = os.path.getsize(filename) / (1024 * 1024) if os.path.exists(filename) else 0
        duration_sec = int(info.get('duration') or get_file_duration(filename))
        title = info.get('title') or os.path.basename(filename)

        rec_id = f"rec-{uuid.uuid4().hex[:8]}"
        rel_path = os.path.relpath(filename, BASE_DIR).replace("\\", "/")
        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        return {
            "id": rec_id,
            "filename": os.path.basename(filename),
            "filepath": rel_path,
            "size_mb": round(file_size_mb, 2),
            "duration_sec": duration_sec,
            "game": game,
            "created_at": created_at,
            "status": "ready",
            "source_url": url
        }
