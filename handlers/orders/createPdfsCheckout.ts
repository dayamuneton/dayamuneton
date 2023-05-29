import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";
import { OrderType } from "../checkoutSessionCompleted/event";
import { reportInitializeCheckoutEvent } from "@/integrations/convertions/events";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";

export const createPdfsCheckout = async ({
   cartItems,
   email,
   name,
   cancel_url,
   success_url,
   cartId,
   language,
}: {
   cartItems: any[];
   email: string;
   name: string;
   cancel_url: string;
   success_url: string;
   cartId?: string;
   language?: string;
}) => {
   try {
      const ordersRef = collection(db, "orders");

      let cartItemsFormatted = cartItems.map((item) => {
         return removeUndefinedEntriesFromObject(item);
      });

      if (language) {
         cartItemsFormatted = cartItemsFormatted.map((item) => ({
            ...item,
            name: `${item.name} ${
               language === "spanish" ? "(spanish)" : "(English)"
            }`,
         }));
      }
      // console.log(cartItemsFormatted);

      const orderRef = await addDoc(ordersRef, {
         cartItems: cartItemsFormatted,
         name: name?.toLowerCase() || "",
         email,
      });

      const createCheckoutSessionPayload = {
         success_url,
         cancel_url,
         email,
         lineItems: cartItemsFormatted,
         order_id: orderRef.id,
         metadata: {
            order_type: "guias_pdf" as OrderType,
            customerEmail: email,
            customerName: name?.toLowerCase(),
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

      if (cartId) {
         const cartRef = doc(db, "shoppingCarts", cartId);
         await updateDoc(cartRef, {
            cartItems: [],
            subTotal: 0,
         });
      }

      await reportInitializeCheckoutEvent(`/${cancel_url}`, email);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
