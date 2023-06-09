import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";
import { OrderType } from "../checkoutSessionCompleted/event";
import { reportInitializeCheckoutEvent } from "@/integrations/convertions/events";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";
import { GuiaProductVariant } from "@/models/guiaProductModel";
import { subscribeCustomerToGroups } from "@/integrations/mailerlite/subscribeCustomerToGroups";

const handleGifts = async (items: any[], email: string, name: string) => {
   const gifts = items.filter((item) => item.price === 0);
   const mailerlite_groups = gifts
      .map((item) => {
         if (
            item.mailerlite_group !== undefined ||
            item.mailerlite_group !== ""
         ) {
            return item.mailerlite_group as string;
         }
      })
      .filter((group) => group !== undefined) as string[];
   await subscribeCustomerToGroups(email, name, mailerlite_groups);
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

      if (cartId) {
         const cartRef = doc(db, "shoppingCarts", cartId);
         await updateDoc(cartRef, {
            cartItems: [],
            subTotal: 0,
         });
      }

      cartItemsFormatted = cartItemsFormatted.filter((item) => {
         return item.price !== 0;
      });

      if (cartItemsFormatted.length === 0) {
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
