# 🎓 Smart University — Microservices Platform

A full-stack microservices-based university management system built with **Spring Boot**, **NestJS**, **React**, **Keycloak**, **RabbitMQ**, and **Docker**.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Services](#services)
- [Infrastructure](#infrastructure)
- [Getting Started](#getting-started)
- [Keycloak Setup](#keycloak-setup)
- [API Reference](#api-reference)
- [Feign Inter-Service Communication](#feign-inter-service-communication)
- [RabbitMQ Event-Driven Architecture](#rabbitmq-event-driven-architecture)
- [Gateway Routing](#gateway-routing)
- [Database Schema](#database-schema)
- [Testing Guide](#testing-guide)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
                          ┌──────────────┐
                          │   Frontend   │
                          │  React/Vite  │
                          │   Port 80    │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  API Gateway │
                          │  Spring Cloud│
                          │  Port 8088   │
                          └──────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
    ┌─────────▼──────┐ ┌───────▼────────┐ ┌───────▼─────────┐
    │ user-service   │ │academic-service│ │ grade-service   │
    │ Port 8081      │ │ Port 8082      │ │ Port 8084       │
    │ H2 (in-memory) │ │ H2 (in-memory) │ │ MySQL           │
    └────────────────┘ └────────────────┘ └─────────────────┘
              │                  │                   │
    ┌─────────▼──────────────────▼───────────────────▼──────────┐
    │                     RabbitMQ (Port 5672)                   │
    │               smart-university-exchange                    │
    └───────────────────────────────────────────────────────────┘
              │                  │                   │
    ┌─────────▼──────┐ ┌───────▼────────┐ ┌───────▼─────────┐
    │ reclamation-   │ │classe-niveau-  │ │  Eureka Server  │
    │ service        │ │service (NestJS)│ │  Port 8761      │
    │ Port 8085      │ │ Port 3000      │ │                 │
    │ MySQL          │ │ MongoDB        │ │                 │
    └────────────────┘ └────────────────┘ └─────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| API Gateway | Spring Cloud Gateway |
| Backend (Java) | Spring Boot 3.2.x, Java 17 |
| Backend (Node) | NestJS 10, TypeScript |
| Service Discovery | Netflix Eureka |
| Authentication | Keycloak 23.0.7 (OAuth2/OIDC) |
| Messaging | RabbitMQ 3 (Topic Exchange) |
| Inter-Service | OpenFeign (Load-balanced) |
| Databases | MySQL 8.0, H2 (in-memory), MongoDB 7 |
| Containerization | Docker, Docker Compose |

---

## Services

| Service | Port | Tech | Database | Description |
|---------|------|------|----------|-------------|
| **eureka-server** | 8761 | Spring Boot | — | Service discovery |
| **api-gateway** | 8088 | Spring Cloud Gateway | — | Routing, JWT validation |
| **user-service** | 8081 | Spring Boot | H2 (in-memory) | Users, roles, Keycloak sync |
| **academic-service** | 8082 | Spring Boot | H2 (in-memory) | Courses, enrollments |
| **grade-service** | 8084 | Spring Boot | MySQL (`grade_db`) | Grades, statistics |
| **reclamation-service** | 8085 | Spring Boot | MySQL (`reclamation_db`) | Student reclamations |
| **classe-niveau-service** | 3000 | NestJS | MongoDB | Classes, levels (niveaux) |
| **frontend** | 80 | React/Vite/Nginx | — | Web UI |

### Infrastructure

| Service | Port | Credentials |
|---------|------|-------------|
| **Keycloak** | 8180 | admin / admin |
| **MySQL** | 3306 | root / root |
| **MongoDB** | 27017 | — (no auth) |
| **RabbitMQ** | 5672 (AMQP), 15672 (UI) | guest / guest |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- PowerShell (for Keycloak setup script)

### Option 1: Docker Compose (Recommended)

```bash
cd e:\11.04.2026

# Build all images
docker-compose build

# Start everything
docker-compose up -d

# Wait ~60 seconds for all services to be healthy
# Then setup Keycloak (see next section)
```

### Option 2: Local Development

Run `start-all.bat` — this starts each service in a separate terminal window using `mvn spring-boot:run`.

### Verify Everything is Running

```bash
# Check containers
docker-compose ps

# Check Eureka (all 6 services should be UP)
# Open: http://localhost:8761
```

---

## Keycloak Setup

After all containers are running, configure Keycloak:

```powershell
# 1. Create the realm
$token = (Invoke-RestMethod -Uri "http://localhost:8180/realms/master/protocol/openid-connect/token" `
  -Method Post -ContentType "application/x-www-form-urlencoded" `
  -Body "username=admin&password=admin&grant_type=password&client_id=admin-cli").access_token

Invoke-RestMethod -Uri "http://localhost:8180/admin/realms" -Method Post `
  -Headers @{Authorization="Bearer $token"} -ContentType "application/json" `
  -Body '{"realm":"smart-university","enabled":true}'

# 2. Create client, roles, and users
powershell -ExecutionPolicy Bypass -File .\setup-keycloak.ps1
```

### Keycloak Configuration

| Setting | Value |
|---------|-------|
| Realm | `smart-university` |
| Client ID | `gateway-client` (public) |
| Roles | `ADMIN`, `TEACHER`, `STUDENT` |

### Default Users

| Username | Password | Role |
|----------|----------|------|
| `admin1` | `admin123` | ADMIN |
| `teacher1` | `teacher123` | TEACHER |
| `student1` | `student123` | STUDENT |

### Get a JWT Token

```powershell
$token = (Invoke-RestMethod -Uri "http://localhost:8180/realms/smart-university/protocol/openid-connect/token" `
  -Method Post -ContentType "application/x-www-form-urlencoded" `
  -Body "username=admin1&password=admin123&grant_type=password&client_id=gateway-client").access_token
```

---

## API Reference

All requests go through the **API Gateway** at `http://localhost:8088`. Include the JWT token in the `Authorization: Bearer <token>` header.

### User Service (`/api/users`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | ADMIN, TEACHER, STUDENT | List all users |
| GET | `/api/users/{id}` | ADMIN, TEACHER | Get user by ID |
| GET | `/api/users/name/{name}` | ADMIN, TEACHER, STUDENT | Get user by name |
| GET | `/api/users/email/{email}` | ADMIN, TEACHER | Get user by email |
| GET | `/api/users/role/{role}` | ADMIN | Get users by role |
| GET | `/api/users/me` | Authenticated | Get current user |
| POST | `/api/users` | ADMIN | Create user |
| PUT | `/api/users/{id}` | ADMIN | Update user |
| DELETE | `/api/users/{id}` | ADMIN | Delete user |

**Create User:**
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@univ.tn",
  "password": "pass123",
  "role": "STUDENT"
}
```

### Academic Service (`/api/academic`)

#### Courses (`/api/academic/courses`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/academic/courses` | ADMIN, TEACHER, STUDENT | List all courses |
| GET | `/api/academic/courses/{id}` | ADMIN, TEACHER, STUDENT | Get course by ID |
| POST | `/api/academic/courses` | ADMIN, TEACHER | Create course |
| PUT | `/api/academic/courses/{id}` | ADMIN, TEACHER | Update course |
| DELETE | `/api/academic/courses/{id}` | ADMIN | Delete course |

**Create Course:**
```json
POST /api/academic/courses
{
  "title": "Mathematics",
  "description": "Advanced Math",
  "credits": 3,
  "professorId": 3
}
```

#### Enrollments (`/api/academic/enrollments`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/academic/enrollments` | STUDENT, TEACHER, ADMIN | List all enrollments |
| GET | `/api/academic/enrollments/student/{id}` | ADMIN, TEACHER, STUDENT | By student |
| GET | `/api/academic/enrollments/course/{id}` | ADMIN, TEACHER | By course |
| POST | `/api/academic/enrollments` | ADMIN, TEACHER | Enroll student |
| PUT | `/api/academic/enrollments/{id}/cancel` | ADMIN, TEACHER | Cancel enrollment |

**Create Enrollment:**
```json
POST /api/academic/enrollments
{
  "studentId": 1,
  "courseId": 1
}
```

### Grade Service (`/api/grades`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/grades` | STUDENT, TEACHER, ADMIN | List all grades |
| GET | `/api/grades/{id}` | STUDENT, TEACHER, ADMIN | Get grade by ID |
| GET | `/api/grades/{id}/details` | TEACHER, ADMIN | Grade + student info (Feign) |
| POST | `/api/grades` | TEACHER, ADMIN | Create grade |
| PUT | `/api/grades/{id}` | TEACHER, ADMIN | Update grade |
| DELETE | `/api/grades/{id}` | ADMIN | Delete grade |
| GET | `/api/grades/stats/average` | Public | Average score |
| GET | `/api/grades/stats/max` | Public | Max score |
| GET | `/api/grades/stats/min` | Public | Min score |
| GET | `/api/grades/stats/count` | Public | Total count |

**Create Grade:**
```json
POST /api/grades
{
  "studentName": "Ahmed Zayen",
  "subject": "Mathematics",
  "examType": "Final",
  "semester": "Spring 2026",
  "score": 85.5
}
```

### Reclamation Service (`/api/reclamations`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/reclamations` | TEACHER, ADMIN | List all reclamations |
| GET | `/api/reclamations/student/{username}` | STUDENT, TEACHER, ADMIN | By student |
| POST | `/api/reclamations` | STUDENT | Create reclamation |
| PUT | `/api/reclamations/{id}` | TEACHER, ADMIN | Update reclamation |
| DELETE | `/api/reclamations/{id}` | ADMIN | Delete reclamation |

**Create Reclamation:**
```json
POST /api/reclamations
{
  "studentName": "Ahmed Zayen",
  "subject": "Mathematics",
  "description": "Grade seems incorrect",
  "type": "NOTE"
}
```
> Types: `NOTE` (validates course via Feign), `GENERAL` (no course validation)

### Classe-Niveau Service

#### Classes (`/api/classes`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/classes` | STUDENT, TEACHER, ADMIN | List all classes |
| GET | `/api/classes/{id}` | STUDENT, TEACHER, ADMIN | Get class by ID |
| GET | `/api/classes/{id}/etudiants` | TEACHER, ADMIN | Get students in class |
| POST | `/api/classes` | ADMIN | Create class |
| PATCH | `/api/classes/{id}` | ADMIN | Update class |
| DELETE | `/api/classes/{id}` | ADMIN | Delete class |
| POST | `/api/classes/{id}/etudiants` | ADMIN | Add students to class |

#### Niveaux (`/api/niveaux`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/niveaux` | STUDENT, TEACHER, ADMIN | List all levels |
| GET | `/api/niveaux/{id}` | STUDENT, TEACHER, ADMIN | Get level by ID |
| POST | `/api/niveaux` | ADMIN | Create level |
| PATCH | `/api/niveaux/{id}` | ADMIN | Update level |
| DELETE | `/api/niveaux/{id}` | ADMIN | Delete level |

---

## Feign Inter-Service Communication

Services communicate synchronously using **OpenFeign** with Eureka load-balancing. A `FeignConfig` bean relays the JWT token from incoming requests to outgoing Feign calls.

### Feign Client Map

```
┌─────────────────────┐       Feign        ┌─────────────────┐
│  reclamation-service │──────────────────►│  user-service    │
│                      │  getUserByName()   │                  │
│                      │──────────────────►│  academic-service│
│                      │  getAllCourses()    │                  │
└──────────────────────┘                    └──────────────────┘

┌─────────────────────┐       Feign        ┌─────────────────┐
│   grade-service      │──────────────────►│  user-service    │
│                      │  getUserByName()   │                  │
│                      │──────────────────►│  academic-service│
│                      │  getAllCourses()    │                  │
└──────────────────────┘                    └──────────────────┘

┌─────────────────────┐       Feign        ┌─────────────────┐
│  academic-service    │──────────────────►│  user-service    │
│                      │  getUserById()     │                  │
│                      │──────────────────►│  grade-service   │
│                      │  getAllGrades()     │                  │
└──────────────────────┘                    └──────────────────┘

┌─────────────────────┐       Feign        ┌─────────────────┐
│   user-service       │──────────────────►│  academic-service│
│                      │  getAllCourses()    │                  │
└──────────────────────┘                    └──────────────────┘
```

### Feign Scenarios

| Service | Action | Feign Calls |
|---------|--------|-------------|
| **reclamation-service** | Create reclamation | `user-service.getUserByName()` — validate student exists |
| **reclamation-service** | Create (type=NOTE) | `academic-service.getAllCourses()` — validate course exists |
| **grade-service** | Create grade | `user-service.getUserByName()` — validate student |
| **grade-service** | Create grade | `academic-service.getAllCourses()` — validate course |
| **grade-service** | GET `/grades/{id}/details` | `user-service.getUserByName()` — enrich with email/role |
| **academic-service** | Create enrollment | `user-service.getUserById()` — validate student exists |

---

## RabbitMQ Event-Driven Architecture

All services connect to a shared **Topic Exchange** (`smart-university-exchange`). Events are routed using topic patterns.

### Exchange & Queues

| Queue | Service | Binding Pattern | Purpose |
|-------|---------|-----------------|---------|
| `enrollment.queue` | academic-service | `enrollment.*` | Own enrollment events |
| `course.queue` | academic-service | `course.*` | Own course events |
| `academic.grade.queue` | academic-service | `grade.*` | Receive grade notifications |
| `academic.reclamation.queue` | academic-service | `reclamation.*` | Receive reclamation notifications |
| `user.notification.queue` | user-service | `enrollment.*`, `grade.*`, `reclamation.*` | Notification hub (all events) |
| `grade.queue` | grade-service | `grade.*` | Own grade events |
| `grade.enrollment.queue` | grade-service | `enrollment.*` | React to student enrollments |
| `grade.course.queue` | grade-service | `course.*` | React to course changes |
| `reclamation.queue` | reclamation-service | `reclamation.*` | Own reclamation events |
| `reclamation.grade.queue` | reclamation-service | `grade.*` | React to grade changes |

### Event Flow

```
Action                    Producer              Routing Key            Consumers
─────────────────────────────────────────────────────────────────────────────────
Create enrollment    → academic-service  →  enrollment.created  →  user-service
                                                                    grade-service

Cancel enrollment    → academic-service  →  enrollment.cancelled → user-service
                                                                    grade-service

Create course        → academic-service  →  course.created      →  grade-service

Update course        → academic-service  →  course.updated      →  grade-service

Delete course        → academic-service  →  course.deleted      →  grade-service

Create grade         → grade-service     →  grade.created       →  user-service
                                                                    academic-service
                                                                    reclamation-service

Update grade         → grade-service     →  grade.updated       →  user-service
                                                                    academic-service
                                                                    reclamation-service

Create reclamation   → reclamation-svc   →  reclamation.created →  user-service
                                                                    academic-service

Update reclamation   → reclamation-svc   →  reclamation.updated →  user-service
                                                                    academic-service
```

### Event Payloads

**EnrollmentEvent:**
```json
{
  "enrollmentId": 1,
  "studentId": 1,
  "courseId": 1,
  "status": "PENDING",
  "eventType": "CREATED",
  "timestamp": "2026-04-13T20:01:29"
}
```

**GradeEvent:**
```json
{
  "gradeId": 1,
  "studentName": "Ahmed Zayen",
  "subject": "Mathematics",
  "score": 85.5,
  "eventType": "CREATED",
  "timestamp": "2026-04-13T20:09:33"
}
```

**ReclamationEvent:**
```json
{
  "reclamationId": 1,
  "studentName": "Ahmed Zayen",
  "subject": "Mathematics",
  "type": "NOTE",
  "status": "PENDING",
  "eventType": "CREATED",
  "timestamp": "2026-04-13T20:08:17"
}
```

**CourseEvent:**
```json
{
  "courseId": 1,
  "courseName": "Mathematics",
  "eventType": "CREATED",
  "timestamp": "2026-04-13T20:07:58"
}
```

---

## Gateway Routing

The API Gateway (`port 8088`) routes requests and rewrites paths:

| Gateway Path | Target Service | Internal Path | Rewrite |
|-------------|----------------|---------------|---------|
| `/api/users/**` | user-service | `/api/users/**` | None (pass-through) |
| `/api/academic/**` | academic-service | `/api/**` | `/api/academic/X` → `/api/X` |
| `/api/grades/**` | grade-service | `/grades/**` | `/api/grades/X` → `/grades/X` |
| `/api/reclamations/**` | reclamation-service | `/reclamations/**` | `/api/reclamations/X` → `/reclamations/X` |
| `/api/classes/**` | classe-niveau-service | `/classes/**` | `/api/classes/X` → `/classes/X` |
| `/api/niveaux/**` | classe-niveau-service | `/niveaux/**` | `/api/niveaux/X` → `/niveaux/X` |

---

## Database Schema

### User Service (H2 — in-memory, reset on restart)

**users**
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | NOT NULL, UNIQUE |
| password | VARCHAR | NOT NULL |
| role | VARCHAR | NOT NULL (STUDENT, TEACHER, ADMIN) |

> 5 users seeded on startup: Ahmed Zayen, Marwa Derbel, Sarah Mohsen, Karim Ben Ali, Admin Omar

### Academic Service (H2 — in-memory, reset on restart)

**courses**
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| title | VARCHAR(100) | NOT NULL, UNIQUE |
| description | TEXT | |
| credits | INT | NOT NULL |
| professor_id | BIGINT | |
| created_at | TIMESTAMP | Auto |

**enrollments**
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| student_id | BIGINT | NOT NULL |
| course_id | BIGINT | FK → courses, NOT NULL |
| enrollment_date | DATE | Auto (current date) |
| status | VARCHAR | PENDING, CONFIRMED, CANCELLED |

### Grade Service (MySQL — `grade_db`)

**grade**
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| student_name | VARCHAR | |
| subject | VARCHAR | |
| exam_type | VARCHAR | |
| semester | VARCHAR | |
| score | DOUBLE | |
| created_at | TIMESTAMP | Auto |

### Reclamation Service (MySQL — `reclamation_db`)

**reclamation**
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| student_name | VARCHAR | |
| subject | VARCHAR | |
| description | VARCHAR(2000) | |
| type | VARCHAR | NOTE, GENERAL |
| status | VARCHAR | PENDING, RESOLVED, ... |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Classe-Niveau Service (MongoDB — `classe-niveau-db`)

**classes** and **niveaux** collections (schema-less, managed by Mongoose).

---

## Testing Guide

### 1. Get Tokens

```powershell
$adminToken = (Invoke-RestMethod -Uri "http://localhost:8180/realms/smart-university/protocol/openid-connect/token" -Method Post -ContentType "application/x-www-form-urlencoded" -Body "username=admin1&password=admin123&grant_type=password&client_id=gateway-client").access_token

$teacherToken = (Invoke-RestMethod -Uri "http://localhost:8180/realms/smart-university/protocol/openid-connect/token" -Method Post -ContentType "application/x-www-form-urlencoded" -Body "username=teacher1&password=teacher123&grant_type=password&client_id=gateway-client").access_token

$studentToken = (Invoke-RestMethod -Uri "http://localhost:8180/realms/smart-university/protocol/openid-connect/token" -Method Post -ContentType "application/x-www-form-urlencoded" -Body "username=student1&password=student123&grant_type=password&client_id=gateway-client").access_token
```

### 2. Create Test Data

```powershell
# List seeded users
Invoke-RestMethod -Uri "http://localhost:8088/api/users" -Headers @{Authorization="Bearer $adminToken"}

# Create a course
Invoke-RestMethod -Uri "http://localhost:8088/api/academic/courses" -Method Post -Headers @{Authorization="Bearer $adminToken"} -ContentType "application/json" -Body '{"title":"Mathematics","description":"Advanced Math","credits":3,"professorId":3}'
```

### 3. Test Feign: Reclamation

```powershell
# type=NOTE → Feign validates student + course
Invoke-RestMethod -Uri "http://localhost:8088/api/reclamations" -Method Post -Headers @{Authorization="Bearer $studentToken"} -ContentType "application/json" -Body '{"studentName":"Ahmed Zayen","subject":"Mathematics","description":"Grade incorrect","type":"NOTE"}'

# Verify Feign logs
docker logs reclamation-service 2>&1 | Select-String "Feign"
```

### 4. Test Feign: Grade

```powershell
# Create grade
Invoke-RestMethod -Uri "http://localhost:8088/api/grades" -Method Post -Headers @{Authorization="Bearer $teacherToken"} -ContentType "application/json" -Body '{"studentName":"Ahmed Zayen","subject":"Mathematics","examType":"Final","semester":"Spring 2026","score":85.5}'

# Get with Feign enrichment (email, role from user-service)
Invoke-RestMethod -Uri "http://localhost:8088/api/grades/1/details" -Headers @{Authorization="Bearer $teacherToken"}

# Verify Feign logs
docker logs grade-service 2>&1 | Select-String "Feign"
```

### 5. Test Feign: Enrollment

```powershell
# Enroll student (Feign validates via user-service)
Invoke-RestMethod -Uri "http://localhost:8088/api/academic/enrollments" -Method Post -Headers @{Authorization="Bearer $adminToken"} -ContentType "application/json" -Body '{"studentId":1,"courseId":1}'

# Cancel
Invoke-RestMethod -Uri "http://localhost:8088/api/academic/enrollments/1/cancel" -Method Put -Headers @{Authorization="Bearer $adminToken"}

# Verify Feign logs
docker logs academic-service 2>&1 | Select-String "Feign"
```

### 6. Test RabbitMQ Events

```powershell
# Check events received by each service
docker logs user-service 2>&1 | Select-String "RabbitMQ"
docker logs academic-service 2>&1 | Select-String "RabbitMQ"
docker logs grade-service 2>&1 | Select-String "RabbitMQ"
docker logs reclamation-service 2>&1 | Select-String "RabbitMQ"
```

Or open **http://localhost:15672** (guest/guest) → Queues tab.

---

## Project Structure

```
smart-university/
├── docker-compose.yml          # Full stack orchestration
├── init-db.sql                 # Creates grade_db and reclamation_db
├── setup-keycloak.ps1          # Keycloak realm/roles/users setup
├── start-all.bat               # Start all services locally
├── stop-all.bat                # Stop all services
├── README.md
│
├── eureka-server/              # Service Discovery (Spring Boot)
│   └── src/main/
│
├── api-gateway/                # API Gateway (Spring Cloud Gateway)
│   └── src/main/resources/
│       ├── application.yml
│       └── application-docker.yml
│
├── user-service/               # User Management (Spring Boot + H2)
│   └── src/main/java/esprit/userservice/
│       ├── controller/UserRestAPI.java
│       ├── model/User.java
│       ├── client/AcademicServiceClient.java  (Feign)
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── RabbitMQConfig.java
│       │   ├── FeignConfig.java
│       │   └── DataInitializer.java
│       └── event/UserEventListener.java
│
├── academic-service/           # Courses & Enrollments (Spring Boot + H2)
│   └── src/main/java/com/univ/academic/
│       ├── controller/
│       │   ├── CourseController.java
│       │   └── EnrollmentController.java
│       ├── entity/Course.java, Enrollment.java
│       ├── dto/
│       ├── client/
│       │   ├── UserServiceClient.java    (Feign)
│       │   └── GradeServiceClient.java   (Feign)
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── RabbitMQConfig.java
│       │   └── FeignConfig.java
│       └── event/
│
├── Grade-Service/Backend/Grade-Service/  # Grades (Spring Boot + MySQL)
│   └── src/main/java/org/example/gradeservice/
│       ├── GradeRestAPI.java
│       ├── Grade.java
│       ├── GradeService.java
│       ├── client/
│       │   ├── UserServiceClient.java    (Feign)
│       │   └── AcademicServiceClient.java (Feign)
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── RabbitMQConfig.java
│       │   └── FeignConfig.java
│       └── event/
│
├── reclamation_service/        # Reclamations (Spring Boot + MySQL)
│   └── src/main/java/org/example/reclamationservice/
│       ├── controller/ReclamationController.java
│       ├── entity/Reclamation.java
│       ├── service/ReclamationService.java
│       ├── client/
│       │   ├── UserServiceClient.java    (Feign)
│       │   └── AcademicServiceClient.java (Feign)
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── RabbitMQConfig.java
│       │   └── FeignConfig.java
│       └── event/
│
├── classe-niveau-service/      # Classes & Levels (NestJS + MongoDB)
│   └── src/
│       ├── app.module.ts
│       ├── main.ts
│       ├── auth/               # JWT guards
│       ├── classes/            # Classes CRUD
│       ├── niveaux/            # Niveaux CRUD
│       └── eureka/             # Eureka registration
│
└── smart-university-frontend/  # React Frontend
    └── src/
        ├── App.tsx
        ├── api/                # Axios clients
        ├── auth/               # Keycloak integration
        ├── components/         # UI components
        ├── pages/              # Route pages
        └── types/              # TypeScript types
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Container shows `Exited` | Run `docker logs <name>` to see error |
| `401 Unauthorized` | Token expired — get a new one |
| `Realm not found` | Create realm first (see Keycloak Setup) |
| `User already exists in Keycloak` | User was already created — use a different name |
| Data missing after restart | user-service & academic-service use H2 in-memory — data resets |
| Feign 401/403 | FeignConfig must relay JWT — check `FeignConfig.java` exists |
| Service not in Eureka | Wait 30s — services register after startup |
| RabbitMQ connection refused | Wait for RabbitMQ healthcheck to pass |
| Port already in use | Run `docker-compose down` then `docker-compose up -d` |
| Frontend can't reach API | Check VITE_API_GATEWAY_URL in docker-compose.yml |

### Useful Commands

```bash
# View logs for a specific service
docker logs <service-name> -f

# Restart a single service
docker-compose restart <service-name>

# Rebuild and restart one service
docker-compose build <service-name> && docker-compose up -d <service-name>

# Stop everything
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v
```

---

## URLs

| Resource | URL |
|----------|-----|
| Frontend | http://localhost |
| API Gateway | http://localhost:8088 |
| Eureka Dashboard | http://localhost:8761 |
| Keycloak Admin | http://localhost:8180 |
| RabbitMQ Dashboard | http://localhost:15672 |
| H2 Console (user-service) | http://localhost:8081/h2-console |
| H2 Console (academic-service) | http://localhost:8082/h2-console |
