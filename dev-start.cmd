@echo off
setlocal
cd /d "%~dp0"
if not exist ".qwen" mkdir ".qwen"
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location '%~dp0'; while ($true) { & node scripts/local-preview.mjs; Start-Sleep -Seconds 2 }" > ".qwen\local-preview-supervisor.log" 2> ".qwen\local-preview-supervisor.err"
echo Local preview is starting at http://127.0.0.1:4173/#components
