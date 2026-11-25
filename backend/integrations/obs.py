import os
import time
import asyncio
from pathlib import Path
from config import RECORDINGS_DIR

class OBSMonitor:
    def __init__(self, watch_dir: Path = RECORDINGS_DIR, check_interval_sec: float = 3.0):
        self.watch_dir = Path(watch_dir)
        self.check_interval_sec = check_interval_sec
        self.is_running = False
        self.known_files = set()
        self.file_sizes = {}

    def start_monitoring(self):
        """Initializes known files before monitoring."""
        self.is_running = True
        if self.watch_dir.exists():
            for f in self.watch_dir.iterdir():
                if f.is_file():
                    self.known_files.add(f.name)

    def stop_monitoring(self):
        self.is_running = False

    async def poll_for_new_recordings(self, on_new_recording_callback=None):
        """Monitors folder and detects when OBS finishes writing a new gameplay recording."""
        while self.is_running:
            try:
                if self.watch_dir.exists():
                    for f in self.watch_dir.iterdir():
                        if not f.is_file() or f.suffix.lower() not in {".mp4", ".mkv", ".mov"}:
                            continue

                        # Check if this is a newly detected file
                        if f.name not in self.known_files:
                            current_size = f.stat().st_size
                            prev_size = self.file_sizes.get(f.name, -1)

                            # If size is stabilized, OBS has finished writing
                            if prev_size != -1 and current_size == prev_size and current_size > 1024 * 1024:
                                print(f"[OBS Monitor] New recording completed: {f.name}")
                                self.known_files.add(f.name)
                                if f.name in self.file_sizes:
                                    del self.file_sizes[f.name]

                                if on_new_recording_callback:
                                    await on_new_recording_callback(str(f))
                            else:
                                # Update size tracker
                                self.file_sizes[f.name] = current_size

                await asyncio.sleep(self.check_interval_sec)
            except Exception as e:
                print(f"[OBS Monitor] Error: {e}")
                await asyncio.sleep(self.check_interval_sec)

obs_monitor = OBSMonitor()
