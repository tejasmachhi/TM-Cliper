@echo off
TITLE TM Cliper - Studio Launcher
echo ========================================================
echo               TM CLIPER - AI VIDEO STUDIO
echo ========================================================
echo.

echo [1/3] Checking Storage Directories...
if not exist "storage\recordings" mkdir storage\recordings
if not exist "storage\clips" mkdir storage\clips
if not exist "storage\thumbnails" mkdir storage\thumbnails
if not exist "storage\subtitles" mkdir storage\subtitles
if not exist "storage\processing" mkdir storage\processing
if not exist "storage\exports" mkdir storage\exports
if not exist "storage\projects" mkdir storage\projects

echo.
echo [2/3] Starting FastAPI Backend on port 8000...
start "TM Cliper - Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo [3/3] Starting Next.js Frontend on port 3000...
start "TM Cliper - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 5 >nul

echo Opening TM Cliper Studio in default browser...
start http://localhost:3000

echo.
echo ========================================================
echo TM Cliper is now running!
echo Dashboard: http://localhost:3000
echo API Docs:  http://127.0.0.1:8000/docs
echo ========================================================
pause
