$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $projectRoot '.qwen\vite-dev.pid'

if (-not (Test-Path $pidFile)) {
  Write-Host 'No saved Vite PID file found.'
  exit 0
}

$pid = Get-Content $pidFile -ErrorAction SilentlyContinue
if (-not $pid) {
  Remove-Item $pidFile -ErrorAction SilentlyContinue
  Write-Host 'PID file was empty and has been removed.'
  exit 0
}

Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
Remove-Item $pidFile -ErrorAction SilentlyContinue

Write-Host "Stopped Vite process $pid."
