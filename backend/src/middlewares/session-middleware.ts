import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { Session } from "../routes/auth";
import { SEVEN_DAYS_IN_MS, THIRTY_MINUTES_IN_MS } from "../constants";

interface SessionMiddlewareRequest extends Request {
  session?: {
    session_id: string;
    csrf_token: string;
    user_id?: number;
  };
}

export const sessionMiddleware = async (
  req: SessionMiddlewareRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  let sessionId = req.cookies?.session_id;

  if (!sessionId) {
    sessionId = uuidv4();
    const csrfToken = uuidv4();
    const expiresAt = new Date(Date.now() + THIRTY_MINUTES_IN_MS);

    await db.query(
      "INSERT INTO sessions (session_id, csrf_token, expires_at) VALUES (?, ?, ?)",
      [sessionId, csrfToken, expiresAt]
    );

    res.cookie("session_id", sessionId, {
      maxAge: SEVEN_DAYS_IN_MS,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("csrf_token", csrfToken, {
      maxAge: SEVEN_DAYS_IN_MS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    const [rows] = await db.query<Session[]>(
      "SELECT * FROM sessions WHERE session_id = ?",
      [sessionId]
    );

    const session = rows[0];

    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.session = {
      session_id: session.session_id,
      csrf_token: session.csrf_token,
      user_id: session.user_id,
    };
  }

  next();
};
