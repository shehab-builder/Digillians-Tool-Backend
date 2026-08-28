import { Router } from "express";
import {
  scheduleTeam,
  getAllScheduledEvaluations,
  getScheduleByLab,
  updateScheduledEvaluation,
  reorderLabSchedule,
  deleteScheduledEvaluation,
} from "../controllers/schedullesController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const scheduledEvaluationRouter = Router();

scheduledEvaluationRouter.use(protect);

// Basic CRUD
scheduledEvaluationRouter
  .route("/")
  .get(getAllScheduledEvaluations)
  .post(restrictTo("ADMIN"), scheduleTeam);

scheduledEvaluationRouter
  .route("/:id")
  .patch(restrictTo("ADMIN"), updateScheduledEvaluation)
  .delete(restrictTo("ADMIN"), deleteScheduledEvaluation);

// Lab Queue routes
scheduledEvaluationRouter.get("/lab/:labId", getScheduleByLab);
scheduledEvaluationRouter.patch(
  "/lab/:labId/reorder",
  restrictTo("ADMIN"),
  reorderLabSchedule,
);

export default scheduledEvaluationRouter;
