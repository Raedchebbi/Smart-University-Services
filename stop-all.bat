@echo off
title Smart University - Stop All Services
color 0C

echo ============================================
echo   Smart University - Stopping All Services
echo ============================================
echo.

:: Kill Java processes (Spring Boot services)
echo Stopping Spring Boot services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8761 :8088 :8081 :8082 :8084 :8085" ^| findstr "LISTENING"') do (
    echo   Killing PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill Node processes (NestJS + Vite)
echo Stopping Node.js services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 :5173" ^| findstr "LISTENING"') do (
    echo   Killing PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Stop Docker containers
echo Stopping Docker containers...
cd /d "E:\11.04.2026"
docker-compose down >nul 2>&1
cd /d "E:\11.04.2026\classe-niveau-service"
docker-compose down >nul 2>&1

echo.
echo ============================================
echo   All services stopped.
echo ============================================
pause
