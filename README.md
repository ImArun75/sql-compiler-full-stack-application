# CipherSQLStudio

A browser-based SQL learning platform where students practice SQL queries against pre-configured assignments with real-time execution and LLM-powered hints.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React.js (CRA) + Vanilla SCSS |
| Backend | Node.js + Express |
| Persistence DB | MongoDB (Mongoose) |
| Sandbox DB | PostgreSQL (pg Pool) |
| SQL Editor | Monaco Editor |
| LLM Hints | gemini-2.5-flash |

## Folder Structure

```
CipherSQLStudio/
├── backend/
│   ├── config/         # mongoose.js, postgres.js
│   ├── controllers/    # assignmentController, executeController, hintController
│   ├── models/         # Assignment.js
│   ├── routes/         # assignments.js, execute.js, hint.js
│   ├── seed.js         # Seeds MongoDB with sample assignments
│   ├── server.js       # Express entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/        # Shared axios client
    │   ├── components/ # QuestionPanel, SampleDataViewer, SqlEditor, ResultsPanel, HintPanel
    │   ├── context/    # WorkspaceContext (global state)
    │   ├── pages/      # AssignmentsPage, AttemptPage
    │   └── styles/     # SCSS variables, mixins, main
    └── .env.example
```

## Setup

### 1. PostgreSQL Sandbox

Create the sandbox database and a restricted role:

```sql
CREATE DATABASE ciphersql_sandbox;
CREATE USER sandbox_student WITH PASSWORD 'yourpassword';
GRANT CONNECT ON DATABASE ciphersql_sandbox TO sandbox_student;

\c ciphersql_sandbox

-- Create tables (admin role - run once)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  salary NUMERIC(10, 2),
  hire_date DATE
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date DATE,
  total_amount NUMERIC(10, 2),
  status VARCHAR(20)
);

-- Grant SELECT-only to sandbox student (they cannot DROP or modify schema)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sandbox_student;

-- Insert sample data
INSERT INTO employees VALUES
  (1, 'Alice', 'Smith', 'Engineering', 85000, '2020-03-15'),
  (2, 'Bob', 'Jones', 'Marketing', 55000, '2021-07-01'),
  (3, 'Carol', 'Davis', 'Engineering', 92000, '2019-11-30'),
  (4, 'Dan', 'Wilson', 'HR', 48000, '2022-01-10'),
  (5, 'Eve', 'Brown', 'Engineering', 78000, '2021-04-20');
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in .env with your actual credentials
npm install
npm run seed     # Seeds assignments into MongoDB
npm run dev      # Starts backend on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start        # Starts React on http://localhost:3000
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Express server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `PG_USER` | PostgreSQL sandbox username |
| `PG_HOST` | PostgreSQL host |
| `PG_DATABASE` | PostgreSQL sandbox database name |
| `PG_PASSWORD` | PostgreSQL sandbox user password |
| `PG_PORT` | PostgreSQL port (default: 5432) |
| `GEMINI_API_KEY` | Gemini API key for LLM hints |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_BASE_URL` | Backend API base URL (default: http://localhost:5000/api) |

## Security Design

- **SQL Sandbox**: All student queries run inside a PostgreSQL transaction that is always `ROLLBACK`ed after execution. This means no student query can permanently modify the dataset.
- **Statement Timeout**: Each query session has a `SET statement_timeout = '5000'` to prevent resource exhaustion.
- **Connection Pooling**: `pg.Pool` manages up to 10 concurrent PostgreSQL connections.
- **LLM Guardrails**: The hint system prompt has 5 hard rules preventing the LLM from ever providing the final SQL solution.
