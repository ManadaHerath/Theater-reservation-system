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
    const [refundList] = await connection.query("SELECT refund_request.id AS refund_id, refund_request.status as status, refund_request.created_at AS created_at,theatres.name AS theatre_name, purchases.created_at AS purchased_time FROM refund_request JOIN purchases ON refund_request.token = purchases.token JOIN theatres ON purchases.theatre_id = theatres.id;");
    res.json(refundList);
}

export const acceptRefund = async (req, res, next) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { id } = req.params;
    const [refundRequest] = await connection.query("SELECT * FROM refund_request WHERE id = ?", [id]);
    


    if (refundRequest.length === 1) {
        
        const refund = await stripe.refunds.create({
            payment_intent: refundRequest[0].pi,
        });
        const [result] = await connection.query("UPDATE refund_request SET status = ? WHERE id = ?", ['accepted', id]);
        const { pi} = refundRequest[0];

        // Delete the corresponding row from the purchases table
        const [result2] = await connection.query(
        "UPDATE purchases SET is_refunded = 1 WHERE pi = ?",
        [pi]
        );
        refundRequest.status = 'Accepted';
        refundRequest.stripeRefundId = refund.id;
        res.status(200).json({ message: "Refund request accepted." });


                    


    } else {
        res.status(404).json({ message: "Refund request not found." });
    }
}

export const denyRefund = async (req, res, next) => {
    const { id } = req.params;
    console.log('deny',id)
    // Query to check if the refund request exists
    const [refundRequest] = await connection.query("SELECT * FROM refund_request WHERE id = ?", [id]);

    if (refundRequest.length === 1) {
        // Update the status of the refund request to 'denied'
        await connection.query("UPDATE refund_request SET status = ? WHERE id = ?", ['denied', id]);
        res.status(200).json({ message: "Refund request denied." });
    } else {
        res.status(404).json({ message: "Refund request not found." });
    }
}
