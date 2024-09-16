import express from "express";
import { verifyJWT } from "../../util/verify_token.js";
import { verifyRoles } from "../../util/verify_roles.js";
import { getRegistrations } from "../../controllers/Admin_Panel/AdminDash.js";
const router = express.Router();

router.get("/registrations", verifyJWT, verifyRoles("admin"), getRegistrations);

export default router;
