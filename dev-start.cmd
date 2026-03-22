@echo off
setlocal
cd /d "%~dp0"
if not exist ".qwen" mkdir ".qwen"
call npm.cmd run build
start "" /b cmd /c node scripts/static-server.mjs
echo Local preview is starting at http://127.0.0.1:4173/#components
