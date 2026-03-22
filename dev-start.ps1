$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$stateDir = Join-Path $projectRoot '.qwen'
$pidFile = Join-Path $stateDir 'vite-dev.pid'
$outFile = Join-Path $stateDir 'vite-dev.out.log'
$errFile = Join-Path $stateDir 'vite-dev.err.log'
$hostUrl = '127.0.0.1'
$port = 5173

if (-not (Test-Path $stateDir)) {
  New-Item -ItemType Directory -Path $stateDir | Out-Null
}

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    Stop-Process -Id $existingPid -Force -ErrorAction SilentlyContinue
  }
  Remove-Item $pidFile -ErrorAction SilentlyContinue
}

$existingListener = netstat -ano | Select-String "$hostUrl`:$port\s+0.0.0.0:0\s+LISTENING" | Select-Object -First 1
if ($existingListener) {
  $existingPortPid = ($existingListener -split '\s+')[-1]
  Stop-Process -Id $existingPortPid -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
}

$process = Start-Process `
  -FilePath 'cmd.exe' `
  -ArgumentList '/c', 'npm.cmd run dev -- --host 127.0.0.1 --port 5173' `
  -WorkingDirectory $projectRoot `
  -RedirectStandardOutput $outFile `
  -RedirectStandardError $errFile `
  -PassThru

Start-Sleep -Seconds 4

$listener = netstat -ano | Select-String "$hostUrl`:$port\s+0.0.0.0:0\s+LISTENING" | Select-Object -First 1
if (-not $listener) {
  Write-Host 'Vite did not start on 127.0.0.1:5173.' -ForegroundColor Red
  if (Test-Path $outFile) {
    Get-Content $outFile -Tail 20
  }
  if (Test-Path $errFile) {
    Get-Content $errFile -Tail 20
  }
  exit 1
}

$listenPid = ($listener -split '\s+')[-1]
Set-Content -Path $pidFile -Value $listenPid

Write-Host "Vite is running at http://127.0.0.1:5173/#components (PID=$listenPid)"
