import expresss from "express";
const router = expresss.Router();
import {
  send_recovery_email,
  verify_otp,
  resetPassword,
} from "../controllers/recoveryPassword.js";

router.post("/send_recovery_email", send_recovery_email);
router.post("/verify-otp", verify_otp);
router.post("/reset", resetPassword);

export default router;
