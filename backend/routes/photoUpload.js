import expresss from "express";
import { photoUpload } from "../controllers/photoUpload.js";

const router = expresss.Router();

router.post("/", photoUpload);

export default router;