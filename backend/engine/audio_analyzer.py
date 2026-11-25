import wave
import numpy as np

def analyze_audio_excitement(wav_path: str, chunk_duration_sec: float = 1.0) -> list:
    """Analyzes audio volume RMS spikes, shouting, and excitement levels per second."""
    try:
        with wave.open(wav_path, "rb") as wf:
            framerate = wf.getframerate()
            n_channels = wf.getnchannels()
            n_frames = wf.getnframes()

            if n_channels == 0 or framerate == 0:
                return []

            chunk_size = int(framerate * chunk_duration_sec)
            audio_data = wf.readframes(n_frames)
            samples = np.frombuffer(audio_data, dtype=np.int16)

            if len(samples) == 0:
                return []

            scores = []
            total_chunks = len(samples) // chunk_size

            # Compute RMS per chunk
            for i in range(total_chunks):
                chunk = samples[i * chunk_size : (i + 1) * chunk_size]
                if len(chunk) == 0:
                    continue

                # Root Mean Square
                rms = np.sqrt(np.mean(chunk.astype(np.float64) ** 2))
                # Convert to dBFS (max 0 dBFS for 16-bit is ~32768)
                if rms > 0:
                    db = 20 * np.log10(rms / 32767.0)
                else:
                    db = -96.0

                # Normalization: map -45dB (ambient) to -5dB (loud scream/explosion) to 0.0 - 1.0
                norm_score = np.clip((db + 45.0) / 40.0, 0.0, 1.0)
                timestamp = i * chunk_duration_sec
                scores.append({"timestamp": timestamp, "score": float(norm_score), "db": float(db)})

            return scores
    except Exception as e:
        print(f"Audio analysis error: {e}")
        return []
