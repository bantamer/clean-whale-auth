import { Request, Response, NextFunction } from "express";

interface CsrfProtectionMiddlewareRequest extends Request {
  session?: {
    session_id: string;
    csrf_token: string;
    user_id?: number;
  };
}

export const csrfProtectionMiddleware = (
  req: CsrfProtectionMiddlewareRequest,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  try {
    if (!req.cookies?.session_id) {
      return res.status(401).json({ message: "Session is missing" });
    }

    const csrfTokenFromHeader = req.headers["x-csrf-token"];

    if (!csrfTokenFromHeader) {
      return res.status(401).json({ message: "CSRF token is missing" });
    }

    if (req.session?.csrf_token !== csrfTokenFromHeader) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next();
  } catch (err) {
    console.error("Error verifying CSRF token", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
