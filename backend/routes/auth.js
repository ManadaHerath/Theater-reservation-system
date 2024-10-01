import expresss from "express";
const router = expresss.Router();
import { register, login, forgotPassword } from "../controllers/auth.js";
import passport from "../controllers/GoogleSignIn.js";

const app = expresss();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

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
    // res.cookie("refresh_token", req.refreshToken, {
    //   httpOnly: true,
    //   sameSite: "Strict",
    //   secure: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.cookie("access_token", req.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 2592000,
    });
    if (req.user.role == "customer") {
      res.redirect("http://localhost:3000");
    } else if (req.user.role == "admin") {
      res.redirect("http://localhost:3000/admin");
    } else if (req.user.role == "theatreAdmin") {
      res.redirect("http://localhost:3000/theatre-admin");
    }
  }
);

export default router;
