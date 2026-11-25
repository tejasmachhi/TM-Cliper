import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"

RECORDINGS_DIR = STORAGE_DIR / "recordings"
CLIPS_DIR = STORAGE_DIR / "clips"
PROCESSING_DIR = STORAGE_DIR / "processing"
THUMBNAILS_DIR = STORAGE_DIR / "thumbnails"
SUBTITLES_DIR = STORAGE_DIR / "subtitles"
EXPORTS_DIR = STORAGE_DIR / "exports"
MODELS_DIR = BASE_DIR / "models"
LOGS_DIR = BASE_DIR / "logs"
CREDENTIALS_DIR = BASE_DIR / "credentials"

# Ensure all directories exist
for d in [RECORDINGS_DIR, CLIPS_DIR, PROCESSING_DIR, THUMBNAILS_DIR, SUBTITLES_DIR, EXPORTS_DIR, MODELS_DIR, LOGS_DIR, CREDENTIALS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

DB_PATH = STORAGE_DIR / "clipmaster.db"
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

def get_ffmpeg_executable():
    """Detects available FFmpeg executable from imageio-ffmpeg, custom path, or PATH."""
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        if exe and os.path.exists(exe):
            return exe
    except Exception:
        pass
    
    # Check custom locations
    custom_paths = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        shutil.which("ffmpeg")
    ]
    for p in custom_paths:
        if p and os.path.exists(p):
            return p
    return "ffmpeg"

FFMPEG_EXE = get_ffmpeg_executable()

# Default Highlight Weights
DEFAULT_WEIGHTS = {
    "gameplay": 30,
    "audio": 20,
    "chat": 20,
    "visual": 15,
    "speech": 10,
    "uniqueness": 5,
}

# Detection Profiles
GAME_PROFILES = {
    "GTA V": {
        "audio_threshold_db": -12.0,
        "visual_motion_threshold": 0.45,
        "pre_roll_sec": 4.0,
        "post_roll_sec": 6.0,
        "event_keywords": ["wasted", "busted", "explosion", "chase", "stunt"]
    },
    "Valorant": {
        "audio_threshold_db": -10.0,
        "visual_motion_threshold": 0.50,
        "pre_roll_sec": 5.0,
        "post_roll_sec": 4.0,
        "event_keywords": ["ace", "clutch", "headshot", "kill", "defuse"]
    },
    "BGMI": {
        "audio_threshold_db": -11.0,
        "visual_motion_threshold": 0.40,
        "pre_roll_sec": 4.0,
        "post_roll_sec": 5.0,
        "event_keywords": ["knock", "kill", "airdrop", "redzone"]
    },
    "General": {
        "audio_threshold_db": -12.0,
        "visual_motion_threshold": 0.40,
        "pre_roll_sec": 3.0,
        "post_roll_sec": 4.0,
        "event_keywords": ["action", "highlight"]
    }
}
