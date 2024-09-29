import expresss from "express";
import {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyJWT,
} from "../util/verify_token.js";
import { addUser, deleteUser, getAnyUser, getUserbyID, updateUser } from "../controllers/user.js";
import { handleRefreshToken } from "../controllers/refreshTokenController.js";
import { getIDFromToken } from "../middlewares/getIDFromToken.js";
import { getAllUsers } from "../controllers/user.js";

const router = expresss.Router();

router.get("/checkAuthentication", verifyToken, (req, res, next) => {
  res.send("Authenticated Bro!");
});

router.get("/checkUser/:id", verifyUser, (req, res, next) => {
  res.send("User Bro!");
});

router.get("/checkAdmin/:id", verifyAdmin, (req, res, next) => {
  res.send("Admin Bro!");
});

router.delete("/:id", verifyUser, (req, res, next) => {
  res.send("Deleted Bro!");
});

router.put("/:id", verifyUser, (req, res, next) => {
  res.send("Updated Bro!");
});

router.get("/getUser", getIDFromToken, getUserbyID);

router.get("/getAnyUser",getAnyUser)

router.get("/allusers", getAllUsers);

router.put('/updateUser/:id', updateUser);

router.delete('/deleteUser/:id', deleteUser);

router.post('/adduser', addUser);


export default router;
