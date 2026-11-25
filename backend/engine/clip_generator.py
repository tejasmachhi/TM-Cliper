import os
import uuid
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models import Recording, Clip, JobQueue
from config import CLIPS_DIR, THUMBNAILS_DIR, SUBTITLES_DIR, PROCESSING_DIR
from engine.video_processor import probe_video, extract_audio, extract_visual_motion, generate_thumbnail, render_clip
from engine.audio_analyzer import analyze_audio_excitement
from engine.scoring_engine import compute_second_by_second_scores, extract_highlight_segments
from engine.subtitle_generator import generate_srt_subtitles

async def process_recording_pipeline(
    job_id: str,
    recording_id: str,
    db: AsyncSession,
    options: dict
):
    """Executes the complete AI highlight extraction, segmentation, subtitling & clip creation pipeline."""
    # Fetch job and recording
    job_stmt = select(JobQueue).where(JobQueue.id == job_id)
    rec_stmt = select(Recording).where(Recording.id == recording_id)

    job = (await db.execute(job_stmt)).scalar_one_or_none()
    rec = (await db.execute(rec_stmt)).scalar_one_or_none()

    if not job or not rec:
        return

    try:
        # Step 1: Probe Video
        job.stage = "Probing Video Metadata"
        job.progress = 10
        job.status = "processing"
        await db.commit()

        video_path = rec.filepath
        meta = probe_video(video_path)
        if meta["duration_sec"] > 0:
            rec.duration_sec = meta["duration_sec"]
            await db.commit()

        # Step 2: Extract Audio & Visual Motion
        job.stage = "Extracting Audio & Visual Signals"
        job.progress = 25
        await db.commit()

        wav_path = str(PROCESSING_DIR / f"{job_id}_audio.wav")
        extract_audio(video_path, wav_path)

        audio_scores = analyze_audio_excitement(wav_path)
        visual_scores = extract_visual_motion(video_path, sample_rate_sec=2)

        # Step 3: Run AI Scoring Engine
        job.stage = "AI Highlight Scoring & Peak Detection"
        job.progress = 50
        await db.commit()

        game = options.get("game", rec.game or "GTA V")
        timeline = compute_second_by_second_scores(audio_scores, visual_scores, game=game)

        min_score = options.get("min_score", 70)
        target_dur = options.get("target_duration", 30)
        max_clips = options.get("max_clips", 4)
        aspect_ratio = options.get("aspect_ratio", "9:16")
        burn_subtitles = options.get("burn_subtitles", True)
        sub_lang = options.get("sub_language", "auto")

        segments = extract_highlight_segments(
            timeline,
            min_score=min_score,
            target_duration=target_dur,
            max_clips=max_clips,
            game=game
        )

        # Step 4: Render Segments & Subtitles
        job.stage = f"Rendering {len(segments)} Highlight Clips"
        job.progress = 70
        await db.commit()

        generated_clips = []
        for i, seg in enumerate(segments):
            clip_id = f"clip-{uuid.uuid4().hex[:8]}"
            clip_filename = f"{clip_id}_{game.lower().replace(' ', '_')}.mp4"
            clip_path = str(CLIPS_DIR / clip_filename)
            thumb_path = str(THUMBNAILS_DIR / f"{clip_id}.jpg")
            srt_path = str(SUBTITLES_DIR / f"{clip_id}.srt")

            # Generate Subtitles
            if burn_subtitles:
                generate_srt_subtitles(wav_path, srt_path, language=sub_lang)

            # Render Video Clip (9:16 Shorts or 16:9)
            render_clip(
                input_video=video_path,
                start_sec=seg["start_time"],
                end_sec=seg["end_time"],
                output_path=clip_path,
                aspect_ratio=aspect_ratio,
                subtitle_srt=srt_path if burn_subtitles else None
            )

            # Generate Thumbnail
            mid_t = seg["start_time"] + (seg["duration"] / 2.0)
            generate_thumbnail(video_path, mid_t, thumb_path)

            # Create Database Record
            new_clip = Clip(
                id=clip_id,
                recording_id=rec.id,
                title=seg["title"],
                description=f"AI-Generated highlight from {rec.filename}. Detected: {seg['event_type']} with AI Score {seg['score']}%. #shorts #gaming #{game.lower().replace(' ', '')}",
                filepath=clip_path,
                thumbnail_path=thumb_path,
                srt_path=srt_path,
                game=game,
                aspect_ratio="9:16 Shorts" if aspect_ratio == "9:16" else "16:9 Standard",
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                duration=seg["duration"],
                score=seg["score"],
                event_type=seg["event_type"],
                has_subtitles=burn_subtitles,
                uploaded=False
            )
            db.add(new_clip)
            generated_clips.append(new_clip)

            job.progress = 70 + int((i + 1) / len(segments) * 25)
            await db.commit()

        # Step 5: Clean temporary audio wav & Complete
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except Exception:
                pass

        job.stage = "Completed"
        job.progress = 100
        job.status = "completed"
        await db.commit()

    except Exception as e:
        print(f"Pipeline error on job {job_id}: {e}")
        job.stage = "Failed"
        job.status = "failed"
        job.error_message = str(e)
        await db.commit()
