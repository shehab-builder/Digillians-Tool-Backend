import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import trackRouter from "./routes/trackRoutes.js";
import labRouter from "./routes/labRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.params, req.url);
  next();
});

// 2. Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/track", trackRouter);
app.use("/api/lab", labRouter);
app.use("/api/teams", teamRouter);
app.use("/api/judge", judgeRouter);
app.use("/api/scheduled-evaluations", scheduledEvaluationRouter);
app.use("/api/evaluations", evaluationRouter);

app.use(globalErrorHandler);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Server is running smoothly!" });
});

export default app;
