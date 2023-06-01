import { OrderType } from "@/handlers/checkoutSessionCompleted/event";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
   apiVersion: "2022-11-15",
});

const formatLineItem = (item: any) => {
   const product_data: any = {
      name: item.name,
   };
   if (item.images?.length > 0 || item.featuredImage) {
      product_data.images = [item.featuredImage || item.images[0]];
   }
   return {
      price_data: {
         currency: "usd",
         product_data,
         unit_amount: item.price * 100, // Convert to cents
      },
      quantity: 1,
   };
};

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });

   const { success_url, cancel_url, lineItems, order_id, metadata, email } =
      req.body;
   // console.log(lineItems);

   const line_items = lineItems.map((item: any) => formatLineItem(item));

   // console.log(line_items);

   try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         line_items,
         mode: "payment",
         success_url: success_url || `${req.headers.origin}/`,
         cancel_url: cancel_url || `${req.headers.origin}/`,
         customer_email: email,
         client_reference_id: order_id || "no_cart_id",
         metadata: {
            order_type: (metadata?.order_type as OrderType) ?? "guias_pdf",
            customerName: metadata?.customerName?.toLowerCase() ?? "no_name",
            customerEmail: metadata?.customerEmail ?? "no_email",
         },
      });

      res.status(200).json(session);
   } catch (error) {
      res.status(500).json(error);
   }
}
