import { connection } from "../index.js";
import Stripe from 'stripe';

export const getRefundRequest = async (req, res, next) => {
    try {
        const { token } = req.params;


        const [refundRequests] = await connection.query("SELECT * FROM purchases WHERE token = ?", [token]);

        if (refundRequests.length > 0) {

            const purchaseInfo = refundRequests[0].pi; 


            await connection.query("INSERT INTO refund_request (token, pi) VALUES (?, ?)", [token, purchaseInfo]);

            res.json({ message: "Refund request processed successfully." });
        } else {
            res.status(404).json({ message: "No matching purchase found for the provided token." });
        }
    } catch (error) {
        next(error);
    }
};

export const deletePurchase = async (req, res, next) => {
    try {
        const { token } = req.params;

        const [result] = await connection.query("DELETE FROM purchases WHERE token = ?", [token]);

        res.status(200).json({ message: "Purchase deleted successfully." });
    } catch (error) {
        next(error);
    }
}


export const getRefunds = async (req, res, next) => {
    const [refundList] = await connection.query("SELECT * FROM refund_request");
    res.json(refundList);
}

export const acceptRefund = async (req, res, next) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { id } = req.params;
    const [refundRequest] = await connection.query("SELECT * FROM refund_request WHERE refund_id = ?", [id]);
    


    if (refundRequest.length === 1) {
        
        const refund = await stripe.refunds.create({
            payment_intent: refundRequest[0].pi,
        });
        console.log('Refund:', refund);
        const [result] = await connection.query("DELETE FROM purchases WHERE token = ?", [refundRequest[0].token]);
        refundRequest.status = 'Accepted';
        refundRequest.stripeRefundId = refund.id;






    } else {
        res.status(404).json({ message: "Refund request not found." });
    }
}

export const denyRefund = async (req, res, next) => {
    const { id } = req.params;
    const [refundRequest] = await connection.query("SELECT * FROM refund_request WHERE refund_id = ?", [id]);

    if (refundRequest.length === 1) {
        await connection.query("DELETE FROM refund_request WHERE refund_id = ?", [id]);
        res.json({ message: "Refund request denied." });
    } else {
        res.status(404).json({ message: "Refund request not found." });
    }
}