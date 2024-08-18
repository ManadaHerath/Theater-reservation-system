import expresss from "express";
import { addActors } from "../controllers/actors.js";

const router = expresss.Router();

router.post("/", addActors);

export default router;