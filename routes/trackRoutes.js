import { Router } from "express";
import {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
} from "../controllers/tracksController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  createCriteria,
  deleteCriteria,
  getCriteriaByTrack,
} from "../controllers/criteriaController.js";

const trackRouter = Router();

// Protect all routes below
trackRouter.use(protect);

trackRouter
  .route("/")
  .post(restrictTo("ADMIN"), createTrack)
  .get(restrictTo("ADMIN"), getAllTracks);

trackRouter
  .route("/:id")
  .get(restrictTo("ADMIN"), getTrackById)
  .patch(restrictTo("ADMIN"), updateTrack)
  .delete(restrictTo("ADMIN"), deleteTrack);

trackRouter
  .route("/:id/criteria")
  .get(getCriteriaByTrack)
  .post(restrictTo("ADMIN"), createCriteria);

trackRouter
  .route("/:id/criteria/:criteriaId")
  .delete(restrictTo("ADMIN"), deleteCriteria);

export default trackRouter; // ✅ CORRECT
