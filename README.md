# TM Cliper — AI Video Clipping & Shorts Platform

An automated AI platform that turns long YouTube videos, podcasts, interviews, and gaming recordings into viral 9:16 vertical Shorts, TikToks, and Reels with guaranteed high-quality 4K/HD rendering.

---

## Architecture

- **Frontend**: Next.js 14, React 18, SCSS design system (no Tailwind / no external heavy UI frameworks).
- **Backend**: FastAPI, FFmpeg (Lanczos 4K/HD scaling, CRF 17 visually lossless profile), yt-dlp (full DASH 4K video + audio stream extraction).
- **Database**: SQLite with SQLAlchemy ORM.

---

## Directory Structure

```text
TM-Cliper/
├── backend/                  # FastAPI Python Backend
│   ├── api/                  # API route controllers
│   ├── database/             # SQLAlchemy models & sessions
│   ├── engine/               # Video engine, AI scoring, subtitling
│   ├── services/             # YouTube service & video cutter
│   ├── Dockerfile            # Container configuration with FFmpeg
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Next.js 14 Web Application
│   ├── src/                  # App router pages, components, SCSS styles
│   ├── public/               # Static assets
│   └── package.json          # Node dependencies
├── storage/                  # Generated clips, thumbnails & exports
├── docker-compose.yml        # Multi-container local & cloud setup
├── render.yaml               # 1-Click Render.com deployment configuration
├── DEPLOYMENT_GUIDE.md       # Step-by-step production deployment instructions
└── start-all.bat             # 1-Click local Windows launcher
```

---

## Quick Start (Local)

1. Double-click `start-all.bat` (Windows).
2. Or run manually:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --port 8000

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## Deployment

Refer to [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for full instructions on deploying:
- **Frontend**: Vercel (Free)
- **Backend**: Render.com (Free Docker container with FFmpeg) or Railway / VPS
