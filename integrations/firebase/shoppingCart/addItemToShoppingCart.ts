import { db } from "@/integrations/firebase/firebaseConfig";
import {
   arrayUnion,
   doc,
   increment,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import { createShoppingCart } from "./createShoppingCart";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";
import { ShoppingCart } from "@/models/shoppingCartModel";
import { GuiaProductVariant } from "@/models/guiaProductModel";
// import { GuiaProduct } from "@/models/guiaProductModel";

export const addItemToCart = async (
   shoppingCart: ShoppingCart | null,
   item: any,
   email: string,
   variant?: GuiaProductVariant
) => {
   try {
      let cart: any = shoppingCart || (await createShoppingCart(email));
      const data = removeUndefinedEntriesFromObject(item);
      if (variant) {
         data.name = `${item.name} (${variant.title})`;
         data.mailerlite_group = variant.mailerlite_group;
      }

      const itemExists = cart.cartItems.some(
         (product: any) => product.name === data.name
      );

      if (itemExists) {
         console.log("Item already exists in cart.");

         return cart;
      }

      const cartDoc = doc(db, "shoppingCarts", cart.id);

      await updateDoc(cartDoc, {
         cartItems: arrayUnion(data),
         subTotal: increment(data.price as number),
         updatedAt: serverTimestamp(),
      });

      const cartItems = [...cart.cartItems, data];
      const cartData = { ...cart, cartItems };

      return new ShoppingCart(cartData);
   } catch (error) {
      console.error("Error adding item to cart: ", error);
      throw new Error("Could not add item to cart.");
   }
};
