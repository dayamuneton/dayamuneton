import type Stripe from "stripe";
import { processCartOrder } from "./processCartOrder";
import { processMembership } from "./processMembership";

export type OrderType = "membresia" | "guias_pdf" | "art" | "gift_card" | "tip";

export default async function checkoutSessionCompletedEvent(session: Stripe.Checkout.Session) {
   switch (session.metadata?.order_type) {
      case "membresia": {
         const email = session.metadata.customerEmail || session.customer_details?.email;
         if (email) await processMembership({ email });
         break;
      }
      case "guias_pdf":
         if (session.client_reference_id && session.client_reference_id !== "no_cart_id") {
            await processCartOrder({ orderId: session.client_reference_id });
         }
         break;
   }
}
