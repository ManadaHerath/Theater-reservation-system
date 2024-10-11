import expresss from "express";
import { connection } from "../index.js";
import {
  getTheatres,
  addTheatre,
  getTheatreById,
  deleteTheatre,
  updateTheatre,
} from "../controllers/theatre.js";
import { verifyAdmin, verifyUser, verifyJWT } from "../util/verify_token.js";
import { verifyRoles } from "../util/verify_roles.js";

const router = expresss.Router();

router.get("/", getTheatres); //,verifyJWT,verifyRoles(['admin'])
router.post("/", verifyJWT, verifyRoles(["admin"]), addTheatre);
router.get("/:id", getTheatreById);
router.put("/:id", updateTheatre);
router.delete("/:id", deleteTheatre);

export default router;
