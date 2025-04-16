import { Router, Request, Response, RequestHandler } from "express";
import { db } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { validateEmail, validatePassword } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export interface Session extends RowDataPacket {
  id: number;
  session_id: string;
  user_id: number;
  created_at: Date;
  csrf_token: string;
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

// POST /auth/register
const registerHandler: RequestHandler = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
) => {
  const { email, password } = req.body;

  // Email validation
  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400).json({ message: emailError });
    return;
  }

  // Password validation
  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400).json({ message: passwordError });
    return;
  }

  try {
    // Check if user already exists
    const [users] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length > 0) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      process.env.SALT as string
    );

    // Insert new user
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/login
const loginHandler: RequestHandler = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
) => {
  const { email, password } = req.body;

  // Email validation
  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400).json({ message: emailError });
    return;
  }

  // Password validation
  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400).json({ message: passwordError });
    return;
  }

  try {
    // Get user
    const [users] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = users[0];

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30m",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /auth/logout
const logoutHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    res.status(400).json({ message: "No session found" });
    return;
  }

  try {
    await db.query("DELETE FROM sessions WHERE session_id = ?", [sessionId]);

    res.clearCookie("session_id");
    res.clearCookie("csrf_token");

    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.delete("/logout", logoutHandler);

export default router;
