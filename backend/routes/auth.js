import expresss from "express";
const router = expresss.Router();
import { register, login } from "../controllers/auth.js";
import passport from "../controllers/GoogleSignIn.js";

const app = expresss();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:3000/");
  }
);

export default router;
