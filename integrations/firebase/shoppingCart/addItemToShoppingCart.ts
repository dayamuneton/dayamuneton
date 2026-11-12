import { doc, runTransaction, serverTimestamp } from "firebase/firestore/lite";
import { db } from "@/integrations/firebase/firestore-lite";
import type { ShoppingCart } from "@/models/shoppingCartModel";
import type { GuiaProductVariant } from "@/models/guiaProductModel";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";

export async function addItemToCart(
   shoppingCart: ShoppingCart | null,
   item: { name: string; handle: string; price: number },
   email: string,
   variant?: GuiaProductVariant,
) {
   // A stable ID prevents two tabs from creating competing carts on their first add.
   const reference = doc(db, "shoppingCarts", shoppingCart?.id || "active:" + encodeURIComponent(email));
   const data = removeUndefinedEntriesFromObject({
      ...item,
      name: variant ? `${item.name} (${variant.title})` : item.name,
      ...(variant && { mailerlite_group: variant.mailerlite_group, variantId: variant.id }),
   });

   await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (snapshot.exists() && snapshot.get("customerEmail") !== email) throw new Error("Unexpected cart owner");
      const existing: ShoppingCart["cartItems"] = snapshot.get("isActive") ? snapshot.get("cartItems") ?? [] : [];
      if (existing.some((entry) => entry.handle === data.handle && entry.name === data.name && entry.variantId === data.variantId)) return;
      const cartItems = [...existing, data];
      transaction.set(reference, {
         customerEmail: email,
         isActive: true,
         isProcessed: false,
         cartItems,
         subTotal: cartItems.reduce((total, entry) => total + Number(entry.price || 0), 0),
         updatedAt: serverTimestamp(),
      }, { merge: true });
   });
}
