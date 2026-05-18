@echo off
REM Music App - Quick Start Script for Windows
REM Starts both backend server and frontend app

echo.
echo 🎵 Music App - Starting Development Environment
echo ============================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Install backend dependencies if needed
if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo 🚀 Starting Music App Backend Server...
echo.
start cmd /k "cd server && npm start"

echo.
echo ⏳ Waiting 3 seconds for server to start...
timeout /t 3 /nobreak

echo.
echo 🎬 Starting Music App Frontend (Expo)...
echo.
call npm start

pause
