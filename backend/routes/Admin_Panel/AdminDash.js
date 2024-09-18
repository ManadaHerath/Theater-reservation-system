import express from "express";
import { verifyJWT } from "../../util/verify_token.js";
import { verifyRoles } from "../../util/verify_roles.js";
import {
  getRegistrations,
  getPurchasedTickets,
  getTicketsByTheatre,
  getTicketsByMovie,
} from "../../controllers/Admin_Panel/AdminDash.js";

const router = express.Router();

router.get("/registrations", verifyJWT, verifyRoles("admin"), getRegistrations);
router.get(
  "/purchased-tickets",
  verifyJWT,
  verifyRoles("admin"),
  getPurchasedTickets
);

router.get(
  "/tickets-based-theatre",
  verifyJWT,
  verifyRoles("admin"),
  getTicketsByTheatre
);
router.get(
  "/tickets-based-movie",
  verifyJWT,
  verifyRoles("admin"),
  getTicketsByMovie
);

export default router;
