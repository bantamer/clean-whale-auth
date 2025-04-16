import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middlewares/session-middleware";
import { csrfProtectionMiddleware } from "./middlewares/csrf-middleware";
import pingRoutes from "./routes/ping";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.WEB_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// @ts-ignore
app.use(sessionMiddleware);
// @ts-ignore
app.use((req, res, next) => {
  const methodsToProtect = ["POST", "PUT", "DELETE"];

  if (methodsToProtect.includes(req.method)) {
    return csrfProtectionMiddleware(req, res, next);
  }

  next();
});
app.use("/auth", authRoutes);
app.use(pingRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
