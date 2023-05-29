import { GuiaProduct } from "@/models/guiaProductModel";
import { ShoppingCart } from "@/models/shoppingCartModel";
import { db } from "@/integrations/firebase/firebaseConfig";
import {
   arrayRemove,
   doc,
   increment,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";

export const removeCartItem = async (
   shoppingCart: ShoppingCart | null,
   item: GuiaProduct,
   customHandle?: string
) => {
   try {
      if (!shoppingCart) return null;

      const cartDoc = doc(db, "shoppingCarts", shoppingCart.id);

      const cartItems = shoppingCart.cartItems.filter(
         (cartItem) => cartItem.handle !== (customHandle || item.handle)
      );
      const removedItem = shoppingCart?.cartItems?.find(
         (cartItem) => cartItem.handle === (customHandle || item.handle)
      );

      if (removedItem === undefined) return null;

      await updateDoc(cartDoc, {
         cartItems: arrayRemove(removedItem),
         subTotal: increment(-removedItem.price),
         updatedAt: serverTimestamp(),
      });

      const cartData = { ...shoppingCart, cartItems };

      return new ShoppingCart(cartData);
   } catch (error) {
      console.error("Error removing item from cart: ", error);
      throw new Error("Could not remove item from cart.");
   }
};
