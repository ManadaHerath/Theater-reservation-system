import expresss from "express";
import { connection } from "../index.js";
import {
  getMovies,
  addMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
} from "../controllers/movie.js";
import {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyJWT,
} from "../util/verify_token.js";
import { verifyRoles } from "../util/verify_roles.js";

const router = expresss.Router();

router.get("/", getMovies);
router.post("/", addMovies);
router.get("/:id", getMovieById);
router.delete("/:id", verifyJWT, verifyRoles("admin"), deleteMovie);
router.put("/:id", verifyJWT, verifyRoles("admin"), updateMovie);

export default router;
