# TM Cliper — Deployment Guide

TM Cliper is a full-stack AI video clipping platform consisting of:
1. **Frontend**: Next.js 14 (React, SCSS)
2. **Backend**: FastAPI (Python 3.11, FFmpeg, yt-dlp)

---

## Method 1: Free Cloud Deployment (Recommended)

### Step 1: Deploy Backend on Render (Free)
1. Push your code to GitHub (or push only the `TM-Cliper` repository).
2. Go to [render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Name**: `tm-cliper-backend`
   - **Root Directory**: `backend` (or leave root if using Dockerfile at root)
   - **Environment**: **Docker**
   - **Instance Type**: **Free**
5. Click **Create Web Service**.
6. Render will build the Docker container (which automatically installs Python, FFmpeg, and yt-dlp).
7. Once deployed, copy your backend URL (e.g. `https://tm-cliper-backend.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://tm-cliper-backend.onrender.com/api` *(replace with your Render backend URL)*
5. Click **Deploy**.
6. Your TM Cliper web application is now live on the internet!

---

## Method 2: 1-Click Cloud VPS Deployment (Docker Compose)
Deploy on any VPS (DigitalOcean Droplet, Hetzner, AWS EC2, Linode, Hostinger):

1. Connect to your VPS via SSH.
2. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd TM-Cliper
   ```
3. Run with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
4. Access:
   - Frontend: `http://<your-server-ip>:3000`
   - Backend API: `http://<your-server-ip>:8000/docs`

---

## Method 3: Deploy Backend on Railway.app
1. Go to [railway.app](https://railway.app) and click **New Project** -> **Deploy from GitHub repo**.
2. Select the repository.
3. Railway automatically detects `backend/Dockerfile` and sets up the container with FFmpeg and Python.
4. In Railway project settings, generate a public domain (e.g. `https://tm-cliper-production.up.railway.app`).
5. Set `NEXT_PUBLIC_API_URL=https://tm-cliper-production.up.railway.app/api` in your Vercel frontend.

---

## Local Development
To run everything locally on your machine:
- Double-click `start-all.bat` on Windows.
- Or run:
  - Terminal 1: `cd backend && python -m uvicorn main:app --reload --port 8000`
  - Terminal 2: `cd frontend && npm run dev`
