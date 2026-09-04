# Smart Student Companion — Python Academic Backend

> **All-in-One Student Productivity Platform — Academic Management Module**  
> Built with **FastAPI**, **MongoDB (Motor)**, and **Pydantic**.

---

## 📌 Project Overview
This repository contains the **Academic Management Backend** for the Smart Student Companion college project. It manages:

1. **Assignment Management**: Complete CRUD operations, priority tags, deadline tracking, and status filtering.
2. **Attendance Management**: Automated percentage calculation, 75% shortage warnings, and consecutive class attendance prediction.
3. **Marks & Academic Analytics**: Auto-total calculation, percentage derivation, configurable letter grading, overall analytics, and a consolidated dashboard endpoint.

---

## 🏗️ Architecture & Data Flow

```text
Student (Browser)
      ↓
React / Next.js Frontend (port 3000)
      ↓  HTTP Request (JSON)
Python FastAPI Server (port 8000)
      ↓  Pydantic Schema Validation
Python Business Logic / Services
      ↓  Motor Asynchronous Driver
MongoDB Database ('smart_student_db')
      ↓  Document Storage / Retrieval
Python FastAPI
      ↓  JSON Response with HTTP Status (200, 201, 400, 404)
React / Next.js Frontend
      ↓
Student UI Dashboard
```

---

## 📂 Project Structure

```
backend/
├── main.py                     # FastAPI entry point & CORS configuration
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment variables
├── .env                        # Local credentials (DO NOT COMMIT)
├── .gitignore                  # Git exclusions for venv and secrets
├── README.md                   # Full documentation & setup guide
│
├── config/
│   └── database.py             # Motor MongoDB client & collection references
│
├── models/                     # Database document transformation helpers
│   ├── assignment.py
│   ├── attendance.py
│   └── marks.py
│
├── schemas/                    # Pydantic validation & response models
│   ├── assignment_schema.py
│   ├── attendance_schema.py
│   ├── marks_schema.py
│   └── dashboard_schema.py
│
├── routes/                     # REST API route handlers
│   ├── assignment_routes.py
│   ├── attendance_routes.py
│   ├── marks_routes.py
│   └── dashboard_routes.py
│
└── services/                   # Core business logic & math formulas
    ├── assignment_service.py
    ├── attendance_service.py
    ├── marks_service.py
    └── analytics_service.py
```

---

## ⚡ Quick Start (Windows PowerShell)

### Step 1: Open VS Code & PowerShell in the backend directory
```powershell
cd backend
```

### Step 2: Create a Virtual Environment
```powershell
python -m venv venv
```

### Step 3: Activate the Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```
*(If you encounter execution policy restrictions, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

### Step 4: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```
Ensure your `MONGODB_URL` is set (e.g., `mongodb://localhost:27017` or your MongoDB Atlas connection string).

### Step 6: Start the Server
```powershell
uvicorn main:app --reload --port 8000
```

### Step 7: Open Interactive Swagger Documentation
Visit: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📊 Summary of API Endpoints

| Method | Endpoint | Purpose | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/assignments` | Create a new assignment | `201 Created` |
| **GET** | `/api/assignments/{student_id}` | Get assignments (with filters) | `200 OK` |
| **GET** | `/api/assignments/item/{id}` | Get single assignment detail | `200 OK` / `404` |
| **PUT** | `/api/assignments/{id}` | Update assignment | `200 OK` / `404` |
| **DELETE** | `/api/assignments/{id}` | Delete assignment | `200 OK` / `404` |
| **POST** | `/api/attendance` | Record/update attendance | `200 OK` |
| **GET** | `/api/attendance/{student_id}` | Get attendance for all subjects | `200 OK` |
| **GET** | `/api/attendance/{student_id}/prediction` | Attendance prediction calculation | `200 OK` |
| **POST** | `/api/marks` | Record subject marks & calculate grade | `200 OK` |
| **GET** | `/api/marks/{student_id}` | Get all marks for student | `200 OK` |
| **GET** | `/api/marks/{student_id}/analytics` | Marks statistics & distribution | `200 OK` |
| **GET** | `/api/academic-dashboard/{student_id}` | Single unified dashboard data | `200 OK` |

---

## 🧮 Mathematical Formulas Implemented

### 1. Attendance Percentage
$$\text{Attendance \%} = \left(\frac{\text{Attended Classes}}{\text{Total Classes}}\right) \times 100$$

### 2. Attendance Prediction (Consecutive Classes to Reach 75%)
$$\text{Classes Needed } (x) = \max\left(0, \left\lceil \frac{75 \cdot T - 100 \cdot A}{25} \right\rceil\right) = \max(0, \lceil 3T - 4A \rceil)$$
Where:
- $T$ = Total classes conducted so far
- $A$ = Attended classes

### 3. Grade Scale
- **90% – 100%**: `A+`
- **80% – 89.99%**: `A`
- **70% – 79.99%**: `B+`
- **60% – 69.99%**: `B`
- **50% – 59.99%**: `C`
- **40% – 49.99%**: `D`
- **Below 40%**: `F`
