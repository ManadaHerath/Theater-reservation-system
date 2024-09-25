import express from "express";
import { verifyJWT } from "../../util/verify_token.js";
import { verifyRoles } from "../../util/verify_roles.js";
import {
  getTheatre,
  updateTheatre,
  getMoviesByTheatre,
} from "../../controllers/Theatre_Admin/TheatreAdmin.js";

const router = express.Router();

router.get("/theatre", verifyJWT, verifyRoles("theatreAdmin"), getTheatre);
router.put(
  "/theatre/:id",
  verifyJWT,
  verifyRoles("theatreAdmin"),
  updateTheatre
);
router.get(
  "/theatre/:id",
  verifyJWT,
  verifyRoles("theatreAdmin"),
  getMoviesByTheatre
);
export default router;
