import expresss from "express";
import { photoUpload } from "../controllers/photoUpload.js";
import multer from "multer";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const router = expresss.Router();

router.post(
  "/",
  upload.fields([{ name: "cover_photo" }, { name: "movie_poster" }]),
  photoUpload
);
router.post('/user-profile',  upload.fields([{ name: "avatar" }]), photoUpload);

export default router;
