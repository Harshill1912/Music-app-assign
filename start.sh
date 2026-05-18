#!/usr/bin/env bash

# Music App - Quick Start Script
# Starts both backend server and frontend app

echo "🎵 Music App - Starting Development Environment"
echo "=============================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

echo ""
echo "🚀 Starting Music App Backend Server..."
cd server
npm start &
SERVER_PID=$!
cd ..

echo ""
echo "⏳ Waiting 2 seconds for server to start..."
sleep 2

echo ""
echo "🎬 Starting Music App Frontend (Expo)..."
npm start

# Cleanup on exit
trap "kill $SERVER_PID" EXIT
