import { connection } from "../index.js";

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
