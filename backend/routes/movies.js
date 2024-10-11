import expresss from "express";
import {
  getMovies,
  addMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  getUpcommingMovies,
} from "../controllers/movie.js";
import { verifyJWT } from "../util/verify_token.js";
import { verifyRoles } from "../util/verify_roles.js";

const router = expresss.Router();

router.get("/", getMovies);
router.get("/upcomming", getUpcommingMovies);
router.post("/", verifyJWT, verifyRoles("admin"), addMovies);
router.get("/:id", getMovieById);
router.delete("/:id", verifyJWT, verifyRoles("admin"), deleteMovie);
router.patch("/:id", verifyJWT, verifyRoles("admin"), updateMovie);

export default router;
