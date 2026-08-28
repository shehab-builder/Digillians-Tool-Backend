import { Router } from "express";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addStudentToTeam,
  removeStudent,
  getAllTeamsNamesOnly,
} from "../controllers/teamsController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const teamRouter = Router();

teamRouter.use(protect);

// Team CRUD
teamRouter.route("/").get(getAllTeams).post(restrictTo("ADMIN"), createTeam);
teamRouter.route("/all").get(getAllTeamsNamesOnly);
teamRouter
  .route("/:id")
  .get(getTeamById)
  .patch(restrictTo("ADMIN"), updateTeam)
  .delete(restrictTo("ADMIN"), deleteTeam);

// Student Management Sub-routes
teamRouter.post("/:teamId/students", restrictTo("ADMIN"), addStudentToTeam);
teamRouter.delete("/students/:studentId", restrictTo("ADMIN"), removeStudent);

export default teamRouter;
