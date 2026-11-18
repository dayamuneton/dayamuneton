import type Stripe from "stripe";
import { fulfillOrder } from "@/features/checkout/server-order";
import { processMembership } from "./processMembership";

export type OrderType = "membresia" | "guias_pdf" | "art" | "gift_card" | "tip";

export default async function checkoutSessionCompletedEvent(session: Stripe.Checkout.Session) {
   if (session.payment_status !== "paid") return;
   switch (session.metadata?.order_type) {
      case "membresia": {
         const email = session.metadata.customerEmail || session.customer_details?.email;
         if (email) await processMembership({ email });
         break;
      }
      case "guias_pdf":
         if (session.client_reference_id && session.client_reference_id !== "no_cart_id") {
            await fulfillOrder(session);
         }
         break;
   }
}
