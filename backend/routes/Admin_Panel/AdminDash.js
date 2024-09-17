import express from "express";
import { verifyJWT } from "../../util/verify_token.js";
import { verifyRoles } from "../../util/verify_roles.js";
import { getRegistrations,getPurchasedTickets } from "../../controllers/Admin_Panel/AdminDash.js";

const router = express.Router();

router.get("/registrations", verifyJWT, verifyRoles("admin"), getRegistrations);
router.get("/purchased-tickets", verifyJWT, verifyRoles("admin"), getPurchasedTickets);

export default router;
