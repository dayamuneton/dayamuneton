import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
   apiVersion: "2022-11-15",
});

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });

   const { amount } = req.body;

   try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         line_items: [
            {
               price_data: {
                  currency: "usd",
                  product_data: {
                     name: "Custom Amount",
                  },
                  unit_amount: amount * 100, // Convert to cents
               },
               quantity: 1,
            },
         ],
         mode: "payment",
         success_url: `${req.headers.origin}/`,
         cancel_url: `${req.headers.origin}/`,
      });

      res.status(200).json(session);
   } catch (error) {
      res.status(500).json(error);
   }
}
