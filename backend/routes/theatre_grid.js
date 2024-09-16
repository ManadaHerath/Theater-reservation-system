import expresss from "express";
import { postTheatreGrid, getTheatreGrid } from "../controllers/theatre_grid.js";

const router = expresss.Router();

router.post("/addtheatregrid", postTheatreGrid);
router.get("/gettheatregrid/:theatre_id", getTheatreGrid);

export default router;