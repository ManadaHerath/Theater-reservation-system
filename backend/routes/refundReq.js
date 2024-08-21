import expresss from "express";
import {getRefundRequest, deletePurchase,acceptRefund} from "../controllers/refundReq.js";


const router = expresss.Router();

router.post("/:token", getRefundRequest);
router.delete("/:token", deletePurchase);
router.get("/admin/accept/:id", acceptRefund);


export default router;