import { collection, doc, runTransaction } from "firebase/firestore/lite";
import { db } from "@/integrations/firebase/firestore-lite";
import { isPreviewSite } from "@/config/site-environment";
import type { OrderType } from "../checkoutSessionCompleted/event";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";

async function claimFreeGuides(items: Record<string, unknown>[], email: string, name: string) {
   const gifts = items.filter(({ price }) => price === 0);
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
}

interface CheckoutRequest {
   cartItems: Record<string, unknown>[];
   email: string;
   name: string;
   cancel_url: string;
   success_url: string;
   cartId?: string;
}

async function removeOrderedItems(cartId: string, ordered: CheckoutRequest["cartItems"]) {
   const cart = doc(db, "shoppingCarts", cartId);
   await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(cart);
      if (!snapshot.exists() || !snapshot.get("isActive")) return;
      const items: CheckoutRequest["cartItems"] = snapshot.get("cartItems") ?? [];
      const remaining = items.filter((item) => !ordered.some((entry) =>
         entry.handle === item.handle && entry.variantId === item.variantId && entry.name === item.name));
      transaction.update(cart, {
         cartItems: remaining,
         subTotal: remaining.reduce((total, item) => total + Number(item.price || 0), 0),
      });
   });
}

export async function createPdfsCheckout({ cartItems, email, name, cancel_url, success_url, cartId }: CheckoutRequest) {
   if (isPreviewSite) return { url: "/thankyou?checkout=preview" };
   const items = cartItems.map(removeUndefinedEntriesFromObject);
   await claimFreeGuides(items, email, name);

   const paidItems = items.filter(({ price }) => price !== 0);
   if (!paidItems.length) {
      if (cartId) await removeOrderedItems(cartId, items);
      return { url: success_url };
   }

   const order = doc(collection(db, "orders"));
   await runTransaction(db, async (transaction) => {
      transaction.set(order, { cartItems: paidItems, name: name.toLowerCase(), email });
   });

   const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
         success_url,
         cancel_url,
         email,
         lineItems: paidItems,
         order_id: order.id,
         metadata: {
            order_type: "guias_pdf" satisfies OrderType,
            customerEmail: email,
            customerName: name.toLowerCase(),
         },
      }),
   });
   if (!response.ok) throw new Error("Could not start checkout.");
   const data: { url?: string } = await response.json();
   if (cartId && data.url) await removeOrderedItems(cartId, items);
   return data;
}
