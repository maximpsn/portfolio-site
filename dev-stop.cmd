@echo off
setlocal
cd /d "%~dp0"
if exist ".qwen\local-preview.pid" (
  for /f %%p in (.qwen\local-preview.pid) do taskkill /PID %%p /F >nul 2>nul
  del /f /q ".qwen\local-preview.pid" >nul 2>nul
  echo Stopped local preview.
) else (
  echo No local preview PID file found.
)
