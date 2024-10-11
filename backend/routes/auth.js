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
    failureRedirect: "https://theater-reservation-system.vercel.app/login",
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
      sameSite: "None",
      domain: ".railway.app",
      secure: true,
      maxAge: 2592000,
    });
    if (req.user.role == "customer") {
      res.redirect("https://theater-reservation-system.vercel.app");
    } else if (req.user.role == "admin") {
      res.redirect("https://theater-reservation-system.vercel.app/admin");
    } else if (req.user.role == "theatreAdmin") {
      res.redirect(
        "https://theater-reservation-system.vercel.app/theatre-admin"
      );
    }
  }
);

export default router;
