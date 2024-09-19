import expresss from "express";
import {getRefundRequest, deletePurchase,acceptRefund,getRefunds,denyRefund} from "../controllers/refundReq.js";


const router = expresss.Router();

router.get("/", getRefunds);
router.post("/admin/deny/:id", denyRefund);
router.post("/:token", getRefundRequest);
router.delete("/:token", deletePurchase);
router.post("/admin/accept/:id", acceptRefund);


export default router;