import { Router } from "express";
import {
  submitProjectEvaluation,
  getProjectEvaluationByTeam,
  submitStudentEvaluationsBatch,
  getStudentEvaluationByStudent,
  getEvaluations,
  getAllEvaluationsByTrack,
} from "../controllers/evaluationsController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const evaluationRouter = Router();

evaluationRouter.use(protect);

evaluationRouter
  .route("/track/:trackId")
  .get(restrictTo("ADMIN"), getAllEvaluationsByTrack);

// Project Evaluation Routes
evaluationRouter
  .route("/projects")
  .post(restrictTo("JUDGE", "ADMIN"), submitProjectEvaluation);

evaluationRouter
  .route("/:sEvalId")
  .get(restrictTo("JUDGE", "ADMIN"), getEvaluations);

evaluationRouter
  .route("/projects/team/:teamId")
  .get(getProjectEvaluationByTeam);

// Student Evaluation Routes
evaluationRouter
  .route("/students")
  .post(restrictTo("JUDGE", "ADMIN"), submitStudentEvaluationsBatch);

evaluationRouter
  .route("/students/student/:studentId")
  .get(getStudentEvaluationByStudent);

export default evaluationRouter;
