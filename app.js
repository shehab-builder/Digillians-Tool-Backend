import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import trackRouter from "./routes/trackRoutes.js";
import labRouter from "./routes/labRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import judgeRouter from "./routes/judgeRoutes.js";
import teamRouter from "./routes/teamsRoutes.js";
import scheduledEvaluationRouter from "./routes/schedullesRoutes.js";
import evaluationRouter from "./routes/evaluationsRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://digillians-front-tool-6wmp.vercel.app",
];

// 1. CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// 2. Routes
app.use("/api/auth", authRoutes);
app.use("/api/track", trackRouter);
app.use("/api/lab", labRouter);
app.use("/api/teams", teamRouter);
app.use("/api/judge", judgeRouter);
app.use("/api/scheduled-evaluations", scheduledEvaluationRouter);
app.use("/api/evaluations", evaluationRouter);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Server is running smoothly!" });
});

app.use(globalErrorHandler);

export default app;
