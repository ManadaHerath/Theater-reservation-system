import expresss from "express";
import {getRefundRequest, deletePurchase} from "../controllers/refundReq.js";


const router = expresss.Router();

router.post("/:token", getRefundRequest);
router.delete("/:token", deletePurchase);


export default router;