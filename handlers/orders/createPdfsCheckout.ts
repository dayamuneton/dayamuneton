import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";
import type { OrderType } from "../checkoutSessionCompleted/event";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";

const handleGifts = async (items: any[], email: string, name: string) => {
   const gifts = items.filter((item) => item.price === 0);
   if (!gifts.length) return;
   const response = await fetch("/api/guides/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         email, name, items: gifts.map(({ handle, variantId, mailerlite_group }) =>
            ({ handle, variantId, group: mailerlite_group })),
      }),
   });
   if (!response.ok) throw new Error("Could not claim the guide.");
};

export const createPdfsCheckout = async ({
   cartItems,
   email,
   name,
   cancel_url,
   success_url,
   cartId,
}: {
   cartItems: any[];
   email: string;
   name: string;
   cancel_url: string;
   success_url: string;
   cartId?: string;
}) => {
   try {
      const ordersRef = collection(db, "orders");

      let cartItemsFormatted = cartItems.map((item) => {
         return removeUndefinedEntriesFromObject(item);
      });

      await handleGifts(cartItemsFormatted, email, name);

      cartItemsFormatted = cartItemsFormatted.filter((item) => {
         return item.price !== 0;
      });

      if (cartItemsFormatted.length === 0) {
         if (cartId) {
            await updateDoc(doc(db, "shoppingCarts", cartId), { cartItems: [], subTotal: 0 });
         }
         return {
            url: success_url,
         };
      }

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
         "/api/stripe/create-checkout-session",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
            body: JSON.stringify(createCheckoutSessionPayload),
         }
      );

      if (!response.ok) throw new Error("Could not start checkout.");
      const data = await response.json();
      if (cartId && data.url) {
         await updateDoc(doc(db, "shoppingCarts", cartId), { cartItems: [], subTotal: 0 });
      }
      return data;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
