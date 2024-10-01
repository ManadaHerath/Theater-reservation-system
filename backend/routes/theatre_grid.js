import expresss from "express";
import { postTheatreGrid, getTheatreGrid, updateSeatTypes } from "../controllers/theatre_grid.js";

const router = expresss.Router();

router.post("/addtheatregrid", postTheatreGrid);
router.get("/gettheatregrid/:theatre_id", getTheatreGrid);
router.put("/updateseattypes/:theatreId", updateSeatTypes);
export default router;