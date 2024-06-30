import express from 'express';
import { handleRefreshToken } from "../controllers/refreshTokenController.js";

const route = express.Router();


route.get("/", handleRefreshToken);


export default route;