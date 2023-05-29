import Stripe from "stripe";
// import { reportPurchaseEvent } from "@/integrations/convertions/events";
import { processCartOrder } from "./processCartOrder";
import { processMembership } from "./processMembership";
// import { processGiftCardOrder } from "./processGiftCardOrder";

export type OrderType =
   | "membresia"
   | "guias_pdf"
   | "art"
   | "gift_card"
   | null
   | undefined;

interface CheckoutSessionCompleted extends Stripe.Event.Data.Object {
   customer_details: {
      name: string;
      email: string;
   };
   id: string;
   cancel_url: string;
   amount_total: number;
   client_reference_id: string;
   metadata: {
      order_type: OrderType;
      customerEmail: string;
      customerName: string;
   };
}
const checkoutSessionCompletedEvent = async (
   checkoutSessionObject: Stripe.Event.Data.Object
) => {
   const checkoutSession = checkoutSessionObject as CheckoutSessionCompleted;

   console.log(checkoutSession);

   const customerEmail =
      checkoutSession.metadata.customerEmail ??
      checkoutSession.customer_details.email;
   const customerName =
      checkoutSession.metadata.customerName ??
      checkoutSession.customer_details.name;

   switch (checkoutSession.metadata.order_type) {
      case "membresia":
         await processMembership({
            email: customerEmail,
         });
         break;
      case "guias_pdf":
         await processCartOrder({
            orderId: checkoutSession.client_reference_id,
         });
         break;

      default:
         console.error(
            `Tipo de orden no reconocido: ${checkoutSession.metadata.order_type}`
         );
         break;
   }

   // const purchaseEventCustomerFirstName =
   //    customerName?.toLowerCase()?.split(" ")[0] || "";

   // await reportPurchaseEvent(
   //    checkoutSession.cancel_url,
   //    customerEmail,
   //    purchaseEventCustomerFirstName,
   //    checkoutSession.amount_total
   // );
};
export default checkoutSessionCompletedEvent;
