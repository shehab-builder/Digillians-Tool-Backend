import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  createJudge,
  deleteJudge,
  getAllJudges,
  getJudgeById,
  updateJudge,
  getMyInfo,
  getAllMySchedulledEvaluations,
} from "../controllers/judgeController.js";

const judgeRouter = Router();

// Protect all judge routes
judgeRouter.use(protect);

// ==========================================
// CURRENT JUDGE ROUTES (MUST BE BEFORE /:id)
// ==========================================
judgeRouter.get("/me", restrictTo("JUDGE"), getMyInfo);
judgeRouter.get(
  "/me/schedules",
  restrictTo("JUDGE"),
  getAllMySchedulledEvaluations,
);

// ==========================================
// ADMIN / GENERAL JUDGE MANAGEMENT
// ==========================================
judgeRouter
  .route("/")
  .get(restrictTo("ADMIN"), getAllJudges)
  .post(restrictTo("ADMIN"), createJudge);

judgeRouter
  .route("/:id")
  .get(restrictTo("ADMIN"), getJudgeById)
  .patch(restrictTo("ADMIN"), updateJudge)
  .delete(restrictTo("ADMIN"), deleteJudge);

export default judgeRouter;
