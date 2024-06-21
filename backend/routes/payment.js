import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router(); // Use 'router' instead of 'route'

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, selectedSeats } = req.body; // Include selectedSeats

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: amount,
                        product_data: {
                            name: 'Seat Booking',
                            description: `Seats: ${selectedSeats.join(', ')}`,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`, // Replace with your success page
            cancel_url: `${process.env.FRONTEND_URL}/cancel`, // Replace with your cancel page
        });

        res.status(200).send({ sessionId: session.id }); 
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;