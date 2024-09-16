import expresss from "express";
import { postTheatreGrid } from "../controllers/theatre_grid.js";

const router = expresss.Router();

router.post("/addtheatregrid", postTheatreGrid);

export default router;