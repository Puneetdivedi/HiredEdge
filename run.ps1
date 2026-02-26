# HiredEdge Unified Startup Script
$ErrorActionPreference = "Stop"

# Force Node.js into the session PATH immediately
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Clear-Host
Write-Host "--- HiredEdge - Full Project Startup ---"

# Detection of Root
$ROOT = "C:\Users\ADMIN\Desktop\hiredge"
if (-not (Test-Path $ROOT)) {
    $ROOT = Get-Location
}
Write-Host "Project Root: $ROOT"

# Cleanup old jobs
Get-Job hiredge_backend -ErrorAction SilentlyContinue | Stop-Job
Get-Job hiredge_backend -ErrorAction SilentlyContinue | Remove-Job

# 1. Start Backend in a NEW window so you can see industry-level logs
Write-Host "[1/2] Starting Backend in a separate window..."
$backendTarget = Join-Path $ROOT "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendTarget'; .\venv\Scripts\activate; uvicorn main:app --port 8000"

Write-Host "Wait 5 seconds for backend to warm up..."
Start-Sleep -Seconds 5

# 2. Start Frontend
Write-Host "[2/2] Starting Frontend (Vite on port 5173)..."
Set-Location "$ROOT\frontend"

# Use .cmd version to bypass PS1 execution policy issues
$NPM = "C:\Program Files\nodejs\npm.cmd"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies (this may take a minute)..."
    & $NPM install
}

Write-Host "App ready! Visit: http://localhost:5173"
& $NPM run dev

# Cleanup
Stop-Job -Name hiredge_backend
Remove-Job -Name hiredge_backend
