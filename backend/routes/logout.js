import express from 'express';
import { handleLogout } from "../controllers/logout.js";

const route = express.Router();


route.get("/", handleLogout);


export default route;