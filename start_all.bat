@echo off
echo =======================================================
echo Email Spam and Phishing Detection System
echo Starting Backend API and Frontend Server...
echo =======================================================

start "Email Detection - Backend API" cmd /k "cd /d %~dp0 && start_backend.bat"
timeout /t 3 /nobreak >nul
start "Email Detection - Frontend UI" cmd /k "cd /d %~dp0 && start_frontend.bat"

echo.
echo Both servers are launching:
echo - Backend API:  http://127.0.0.1:8000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo - Frontend UI:  http://localhost:5173
echo =======================================================
