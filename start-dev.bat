@echo off
title DriveGo Dev
cd /d "%~dp0"

echo.
echo  DriveGo: Frontend + Backend + ngrok
echo  Dung Ctrl+C de tat ca.
echo.

call npm run dev:all

if errorlevel 1 (
  echo.
  echo  Co loi. Neu thieu ngrok, them vao .env:
  echo    NGROK_PATH=C:\duong\dan\toi\ngrok.exe
  echo.
  pause
)
