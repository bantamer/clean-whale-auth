# Backend Setup Guide

## 📦 Install Dependencies

```bash
cd ./backend
npm install
```

---

## 🔐 Generate Salt

Generate a bcrypt salt:

```bash
node -e "require('bcrypt').genSalt(10).then(console.log)"
```

Copy the output and add it to your `.env` file as:

```env
SALT=<YOUR_GENERATED_SALT>
```

---

## ⚙️ Configure Environment

Add the following variables to your `.env` file:

```env
# Database Configuration
DB_HOST=<YOUR_DB_HOST>
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_NAME=clean_whale_auth_test

# Auth and Server
JWT_SECRET=<RANDOM_SECRET_KEY>
PORT=8000
```

---

## 🛠️ Initialize the Database

Run the following command to create the database and tables:

```bash
npm run init-db
```

> This command runs the `create-db.ts` script, which connects to your MySQL server using the provided `.env` credentials.
> It will create the database (if it doesn't already exist) and set up all necessary tables required for authentication.

---

## 🚀 Run the Backend

Start the development server:

```bash
npm run dev
```

# Frontend Setup Guide

## 🌐 Set Environment Variables

Create a `.env` file in the root of the frontend project and add:

```env
API_URL=http://localhost:8000
```

> `API_URL` should point to the backend server address.
> For local development, use `http://localhost:8000` (or your backend host and port if different).

---

## 🚀 Start the Frontend

```bash
cd ./frontend
npm install
npm start
```

### 🧩 Tech Stack Overview

**Frontend: React + TypeScript**

Implemented pages:

- **Login** – `/login`
- **Sign Up** – `/sign-up`
- **Welcome** – `/welcome`

🛡️ CSRF Protection

CSRF protection is implemented using a session ID stored in an HTTP-only cookie and a CSRF token.
On the first request, a new session is created in the database with a unique session_id and csrf_token.
• The session_id is stored in a cookie.
• The csrf_token is sent in the response header x-csrf-token.
• The frontend must include this token in the x-csrf-token request header on each subsequent request.

Each request is validated by matching the session_id from cookies with the corresponding session in the database and comparing the provided CSRF token.

✅ Authentication is handled via **JWT tokens**, which are stored in the **AuthContext** after login.

✅ Validation

Input validation is implemented both on the **frontend** and **backend**:

- On the **frontend**, form fields are validated before submission (e.g., email format, password length).
- On the **backend**, all input data is revalidated to ensure correctness and security.

---

**Backend: Express + TypeScript**

**Database:** MySQL

### ✅ How to Test the Functionality

To test the app:

1. **Create a new user** using the **Sign Up** form at [`/sign-up`](#/sign-up).
2. After successful registration, log in via the **Login** page.
3. Upon logging in, you'll be redirected to the **Welcome** page.

All interactions are protected using **session IDs** and **JWT-based authentication**.
