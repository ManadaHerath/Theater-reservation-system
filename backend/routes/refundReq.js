import expresss from "express";
import {getRefundRequest, deletePurchase,acceptRefund,getRefunds,denyRefund} from "../controllers/refundReq.js";


const router = expresss.Router();

router.get("/", getRefunds);
router.delete("admin/deny/:id", denyRefund);
router.post("/:token", getRefundRequest);
router.delete("/:token", deletePurchase);
router.get("/admin/accept/:id", acceptRefund);


export default router;