import os
import re
import json
import zipfile
import subprocess
from pathlib import Path
from typing import List, Dict, Any

try:
    from backend.database.session import BASE_DIR, STORAGE_DIR, PROJECTS_DIR
    from backend.engine.video_engine import get_ffmpeg_path
except ImportError:
    from database.session import BASE_DIR, STORAGE_DIR, PROJECTS_DIR
    from engine.video_engine import get_ffmpeg_path

def get_project_dirs(project_id: str) -> Dict[str, Path]:
    proj_root = PROJECTS_DIR / project_id
    clips_dir = proj_root / "clips"
    thumbs_dir = proj_root / "thumbnails"
    subs_dir = proj_root / "subtitles"
    exports_dir = proj_root / "exports"

    os.makedirs(clips_dir, exist_ok=True)
    os.makedirs(thumbs_dir, exist_ok=True)
    os.makedirs(subs_dir, exist_ok=True)
    os.makedirs(exports_dir, exist_ok=True)

    return {
        "root": proj_root,
        "clips": clips_dir,
        "thumbnails": thumbs_dir,
        "subtitles": subs_dir,
        "exports": exports_dir
    }

def get_video_dimensions(filepath: str) -> tuple:
    """Returns (width, height) of the video using FFmpeg probe."""
    try:
        ffmpeg_exe = get_ffmpeg_path()
        cmd = [ffmpeg_exe, "-i", filepath]
        res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL, text=True, errors='replace')
        match = re.search(r",\s*(\d{3,5})x(\d{3,5})", res.stderr)
        if match:
            return int(match.group(1)), int(match.group(2))
    except Exception:
        pass
    return (1920, 1080)

def cut_clip(source_path: str, output_path: str, start_sec: float, duration_sec: int, aspect_ratio: str = "9:16") -> bool:
    ffmpeg_exe = get_ffmpeg_path()
    src_w, src_h = get_video_dimensions(source_path)

    # Adaptive Ultra-HD / 4K / Full HD rendering with Lanczos resampling
    is_4k = (src_h >= 1440 or src_w >= 2560)

    if aspect_ratio == "9:16":
        # 4K vertical (2160x3840) or Full HD vertical (1080x1920)
        target_w, target_h = (2160, 3840) if is_4k else (1080, 1920)
        vf_filter = f"scale=-2:{target_h}:flags=lanczos,crop={target_w}:{target_h}:(in_w-{target_w})/2:0"
    elif aspect_ratio == "1:1":
        # Square 4K (2160x2160) or 1080p (1080x1080)
        target_size = 2160 if is_4k else 1080
        vf_filter = f"scale=-2:{target_size}:flags=lanczos,crop={target_size}:{target_size}:(in_w-{target_size})/2:0"
    else:
        # Standard Widescreen 16:9
        target_w, target_h = (3840, 2160) if is_4k else (1920, 1080)
        vf_filter = f"scale={target_w}:{target_h}:flags=lanczos"

    cmd = [
        ffmpeg_exe, "-y",
        "-ss", str(start_sec),
        "-i", source_path,
        "-t", str(duration_sec),
        "-vf", vf_filter,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "17",
        "-c:a", "aac",
        "-b:a", "320k",
        "-movflags", "+faststart",
        output_path
    ]

    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, errors='replace')
    if res.returncode != 0 or not os.path.exists(output_path):
        print(f"Primary cut note: {res.stderr[:200] if res.stderr else 'retrying simple cut'}")
        cmd_fallback = [
            ffmpeg_exe, "-y",
            "-ss", str(start_sec),
            "-i", source_path,
            "-t", str(duration_sec),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "18",
            "-c:a", "aac",
            "-b:a", "320k",
            "-movflags", "+faststart",
            output_path
        ]
        subprocess.run(cmd_fallback, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return os.path.exists(output_path) and os.path.getsize(output_path) > 1000

def generate_thumbnail(video_path: str, thumb_path: str):
    ffmpeg_exe = get_ffmpeg_path()
    cmd = [
        ffmpeg_exe, "-y",
        "-ss", "00:00:01",
        "-i", video_path,
        "-vframes", "1",
        "-q:v", "2",
        thumb_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def create_synthetic_demo_clip(output_path: str, duration_sec: int = 15, title: str = "AI Clip", aspect_ratio: str = "9:16"):
    ffmpeg_exe = get_ffmpeg_path()
    w, h = (1080, 1920) if aspect_ratio == "9:16" else (1920, 1080)
    
    cmd = [
        ffmpeg_exe, "-y",
        "-f", "lavfi", "-i", f"testsrc=duration={duration_sec}:size={w}x{h}:rate=30",
        "-f", "lavfi", "-i", f"sine=frequency=440:duration={duration_sec}",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-movflags", "+faststart",
        "-shortest",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def generate_project_zip(project_id: str, project_name: str) -> str:
    dirs = get_project_dirs(project_id)
    zip_filename = f"{re.sub(r'[^a-zA-Z0-9_-]', '_', project_name)}_clips.zip"
    zip_path = dirs["exports"] / zip_filename

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for clip_file in os.listdir(dirs["clips"]):
            if clip_file.endswith(".mp4"):
                fp = dirs["clips"] / clip_file
                zipf.write(fp, arcname=f"clips/{clip_file}")
        
        meta_file = dirs["root"] / "source_metadata.json"
        if os.path.exists(meta_file):
            zipf.write(meta_file, arcname="source_metadata.json")

    return str(zip_path)
