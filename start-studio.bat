@echo off
title Altar Loops Studio Backup
echo ===================================================
echo   Altar Loops Studio - Backup Local + High-Quality Video Renderer
echo ===================================================
echo.
echo Iniciando o servidor local na porta 3000...
start "" "http://localhost:3000/studio"
node server.js
pause
