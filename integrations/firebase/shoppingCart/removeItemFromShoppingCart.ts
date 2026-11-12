import type { ShoppingCart } from "@/models/shoppingCartModel";
import { db } from "@/integrations/firebase/firestore-lite";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore/lite";

export async function removeCartItem(
   shoppingCart: ShoppingCart | null,
   item: { handle: string; name: string; variantId?: string },
) {
   if (!shoppingCart) return;
   const reference = doc(db, "shoppingCarts", shoppingCart.id);

   await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists() || !snapshot.get("isActive")) return;
      const items: ShoppingCart["cartItems"] = snapshot.get("cartItems") ?? [];
      const index = items.findIndex((entry) => entry.handle === item.handle && entry.name === item.name && entry.variantId === item.variantId);
      if (index < 0) return;
      const remaining = items.filter((_, position) => position !== index);
      transaction.update(reference, {
         cartItems: remaining,
         subTotal: remaining.reduce((total, entry) => total + Number(entry.price || 0), 0),
         updatedAt: serverTimestamp(),
      });
   });
}
