import asyncio
from datetime import datetime
from database.db import AsyncSessionLocal
from database.models import Clip
from integrations.youtube_api import youtube_manager
from sqlalchemy import select

class UploadScheduler:
    def __init__(self, check_interval_sec: float = 30.0):
        self.check_interval_sec = check_interval_sec
        self.is_running = False

    async def start(self):
        self.is_running = True
        while self.is_running:
            try:
                # In real scenario, queries scheduled uploads
                await asyncio.sleep(self.check_interval_sec)
            except Exception as e:
                print(f"[Scheduler Error]: {e}")
                await asyncio.sleep(self.check_interval_sec)

    def stop(self):
        self.is_running = False

upload_scheduler = UploadScheduler()
