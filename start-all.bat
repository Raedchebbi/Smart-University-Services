@echo off
title Smart University - Full Stack Launcher
color 0A

echo ============================================
echo   Smart University - Starting All Services
echo ============================================
echo.

:: ── Step 1: Docker (Keycloak + MongoDB) ──
echo [1/8] Starting Docker containers (Keycloak + MongoDB)...
cd /d "E:\11.04.2026"
start "Docker-Keycloak" cmd /k "docker-compose up -d && echo Keycloak started on port 8180"
cd /d "E:\11.04.2026\classe-niveau-service"
start "Docker-MongoDB" cmd /k "docker-compose up -d && echo MongoDB started on port 27017"

echo       Waiting 15 seconds for Docker containers...
timeout /t 15 /nobreak >nul

:: ── Step 2: Eureka Server (8761) ──
echo [2/8] Starting Eureka Server (port 8761)...
cd /d "E:\11.04.2026\eureka-server"
start "Eureka-Server-8761" cmd /k "title Eureka Server [8761] && mvn spring-boot:run"

echo       Waiting 20 seconds for Eureka to be ready...
timeout /t 20 /nobreak >nul

:: ── Step 3: API Gateway (8088) ──
echo [3/8] Starting API Gateway (port 8088)...
cd /d "E:\11.04.2026\api-gateway"
start "API-Gateway-8088" cmd /k "title API Gateway [8088] && mvn spring-boot:run"

echo       Waiting 15 seconds for Gateway...
timeout /t 15 /nobreak >nul

:: ── Step 4: User Service (8081) ──
echo [4/8] Starting User Service (port 8081)...
cd /d "E:\11.04.2026\user-service"
start "User-Service-8081" cmd /k "title User Service [8081] && mvn spring-boot:run"

:: ── Step 5: Academic Service (8082) ──
echo [5/8] Starting Academic Service (port 8082)...
cd /d "E:\11.04.2026\academic-service"
start "Academic-Service-8082" cmd /k "title Academic Service [8082] && mvn spring-boot:run"

:: ── Step 6: Grade Service (8084) ──
echo [6/8] Starting Grade Service (port 8084)...
cd /d "E:\11.04.2026\Grade-Service\Backend\Grade-Service"
start "Grade-Service-8084" cmd /k "title Grade Service [8084] && mvn spring-boot:run"

:: ── Step 7: Reclamation Service (8085) ──
echo [7/8] Starting Reclamation Service (port 8085)...
cd /d "E:\11.04.2026\reclamation_service"
start "Reclamation-Service-8085" cmd /k "title Reclamation Service [8085] && mvn spring-boot:run"

echo       Waiting 10 seconds for Spring services...
timeout /t 10 /nobreak >nul

:: ── Step 8: NestJS Classe-Niveau Service (3000) ──
echo [8/8] Starting Classe-Niveau Service (port 3000)...
cd /d "E:\11.04.2026\classe-niveau-service"
start "Classe-Niveau-3000" cmd /k "title Classe-Niveau [3000] && npm run start:dev"

:: ── Step 9: React Frontend (5173) ──
echo [FRONTEND] Starting React Frontend (port 5173)...
cd /d "E:\11.04.2026\smart-university-frontend"
start "Frontend-5173" cmd /k "title Frontend [5173] && npm run dev"

echo.
echo ============================================
echo   All services are starting!
echo ============================================
echo.
echo   Keycloak:          http://localhost:8180
echo   Eureka:            http://localhost:8761
echo   API Gateway:       http://localhost:8088
echo   User Service:      http://localhost:8081
echo   Academic Service:  http://localhost:8082
echo   Grade Service:     http://localhost:8084
echo   Reclamation Svc:   http://localhost:8085
echo   Classe-Niveau Svc: http://localhost:3000
echo   Frontend:          http://localhost:5173
echo.
echo   Credentials:
echo     admin1    / password123  (ADMIN)
echo     teacher1  / password123  (TEACHER)
echo     student1  / password123  (STUDENT)
echo.
echo   Wait ~60 seconds for all services to fully start.
echo   Then open: http://localhost:5173
echo ============================================

:: Open frontend in browser after 60 seconds
timeout /t 60 /nobreak >nul
start http://localhost:5173

pause
