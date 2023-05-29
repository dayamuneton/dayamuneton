import { reportInitializeCheckoutEvent } from "@/integrations/convertions/events";
import { db } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { OrderType } from "../checkoutSessionCompleted/event";

export const createMembershipOrder = async ({
   email,
   cancel_url,
   success_url,
}: {
   email: string;
   cancel_url?: string;
   success_url?: string;
}) => {
   try {
      const ordersRef = collection(db, "orders");
      const orderRef = await addDoc(ordersRef, {
         email,
      });

      const createCheckoutSessionPayload = {
         success_url: success_url || "membresia",
         cancel_url: cancel_url || "membresia",
         priceID: process.env.NEXT_PUBLIC_STRIPE_MEMBRESIA,
         order_id: orderRef.id,
         metadata: {
            customerEmail: email,
            order_type: "membresia" as OrderType,
         },
      };

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_MY_DOMAIN}/api/stripe/create-checkout-session`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
            body: JSON.stringify(createCheckoutSessionPayload),
         }
      );
      await reportInitializeCheckoutEvent(`/${cancel_url}`, email);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
