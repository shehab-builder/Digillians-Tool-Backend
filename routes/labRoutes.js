import { Router } from "express";
import {
  createLab,
  getAllLabs,
  getLabById,
  updateLab,
  deleteLab,
} from "../controllers/labsController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const labRouter = Router();

// Protect all lab routes
labRouter.use(protect);

labRouter.route("/").get(getAllLabs).post(restrictTo("ADMIN"), createLab);

labRouter
  .route("/:id")
  .get(getLabById)
  .patch(restrictTo("ADMIN"), updateLab)
  .delete(restrictTo("ADMIN"), deleteLab);

export default labRouter;
