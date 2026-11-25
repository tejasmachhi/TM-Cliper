import os
import subprocess
import json
import cv2
import numpy as np
from config import FFMPEG_EXE

def probe_video(filepath: str) -> dict:
    """Probes video metadata using FFmpeg."""
    cmd = [
        FFMPEG_EXE,
        "-i", filepath,
        "-hide_banner"
    ]
    process = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, errors="replace")
    stderr = process.stderr

    duration_sec = 0.0
    width = 1920
    height = 1080
    fps = 30.0

    # Parse Duration: 00:01:23.45
    for line in stderr.splitlines():
        if "Duration:" in line:
            try:
                parts = line.split("Duration:")[1].split(",")[0].strip().split(":")
                duration_sec = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
            except Exception:
                pass
        if "Video:" in line:
            try:
                # Find resolution e.g. 1920x1080
                tokens = line.split(",")
                for tok in tokens:
                    tok = tok.strip()
                    if "x" in tok and any(c.isdigit() for c in tok):
                        subtoks = tok.split()[0].split("x")
                        if len(subtoks) == 2 and subtoks[0].isdigit() and subtoks[1].isdigit():
                            width = int(subtoks[0])
                            height = int(subtoks[1])
                    if "fps" in tok:
                        fps = float(tok.replace("fps", "").strip())
            except Exception:
                pass

    return {
        "duration_sec": duration_sec,
        "width": width,
        "height": height,
        "fps": fps,
        "filepath": filepath
    }

def extract_audio(video_path: str, out_wav_path: str) -> bool:
    """Extracts 16kHz mono WAV audio from video for AI processing."""
    cmd = [
        FFMPEG_EXE,
        "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        out_wav_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return res.returncode == 0

def extract_visual_motion(video_path: str, sample_rate_sec: float = 1.0) -> list:
    """Samples video frames using OpenCV to calculate motion intensity & scene changes."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_interval = int(fps * sample_rate_sec)
    
    prev_gray = None
    motion_scores = []
    current_frame = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if current_frame % frame_interval == 0:
            # Resize for fast processing on CPU
            small = cv2.resize(frame, (320, 180))
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            gray = cv2.GaussianBlur(gray, (21, 21), 0)

            if prev_gray is not None:
                delta = cv2.absdiff(prev_gray, gray)
                thresh = cv2.threshold(delta, 25, 255, cv2.THRESH_BINARY)[1]
                motion_score = np.sum(thresh) / (320 * 180 * 255) # normalized 0.0 to 1.0
                timestamp = current_frame / fps
                motion_scores.append({"timestamp": timestamp, "score": float(motion_score)})
            
            prev_gray = gray

        current_frame += 1

    cap.release()
    return motion_scores

def generate_thumbnail(video_path: str, timestamp_sec: float, out_jpg_path: str) -> bool:
    """Captures a video thumbnail at the specified timestamp."""
    cmd = [
        FFMPEG_EXE,
        "-y",
        "-ss", str(max(0, timestamp_sec)),
        "-i", video_path,
        "-vframes", "1",
        "-q:v", "2",
        out_jpg_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return res.returncode == 0

def render_clip(
    input_video: str,
    start_sec: float,
    end_sec: float,
    output_path: str,
    aspect_ratio: str = "9:16",
    subtitle_srt: str = None,
    use_gpu: bool = True
) -> bool:
    """Cuts and renders high-quality clip with vertical 9:16 crop and optional subtitles."""
    duration = end_sec - start_sec

    meta = probe_video(input_video)
    is_4k = (meta.get("height", 1080) >= 1440 or meta.get("width", 1920) >= 2560)

    filters = []
    if aspect_ratio == "9:16":
        # 9:16 vertical crop centered for Shorts (4K or Full HD)
        target_w, target_h = (2160, 3840) if is_4k else (1080, 1920)
        filters.append(f"crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale={target_w}:{target_h}:flags=lanczos")
    else:
        target_w, target_h = (3840, 2160) if is_4k else (1920, 1080)
        filters.append(f"scale={target_w}:{target_h}:flags=lanczos")

    if subtitle_srt and os.path.exists(subtitle_srt):
        escaped_srt = subtitle_srt.replace("\\", "/").replace(":", "\\:")
        # Cyan text with bold outline for gaming Shorts style
        filters.append(f"subtitles='{escaped_srt}':force_style='FontSize=20,PrimaryColour=&H00E5FF&,OutlineColour=&H000000&,BorderStyle=3,Bold=1,MarginV=70'")

    vf = ",".join(filters)

    cmd = [
        FFMPEG_EXE,
        "-y",
        "-ss", str(start_sec),
        "-t", str(duration),
        "-i", input_video,
        "-vf", vf,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "17",
        "-c:a", "aac",
        "-b:a", "320k",
        "-movflags", "+faststart",
        output_path
    ]

    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return res.returncode == 0 and os.path.exists(output_path)
