import { reportInitializeCheckoutEvent } from "@/integrations/convertions/events";
import { db } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { OrderType } from "../checkoutSessionCompleted/event";

export const createGiftCardCheckout = async ({
   email,
   cancel_url,
}: {
   email: string;
   cancel_url: string;
}) => {
   // TODO: create a gift card price in stripe

   try {
      const ordersRef = collection(db, "orders");
      const orderRef = await addDoc(ordersRef, {
         email,
      });

      const createCheckoutSessionPayload = {
         success_url: "gracias",
         cancel_url,
         priceID: "",
         order_id: orderRef.id,
         metadata: {
            order_type: "gift_card" as OrderType,
            customerEmail: email,
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
