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
// import { GuiaProduct } from "@/models/guiaProductModel";

export const addItemToCart = async (
   shoppingCart: ShoppingCart | null,
   item: any,
   email: string,
   customHandle?: string,
   customName?: string,
   language?: string
) => {
   try {
      let cart: any = shoppingCart || (await createShoppingCart(email));

      const itemExists = cart.cartItems.some(
         (product: any) => product.handle === item.handle
      );

      if (itemExists) {
         console.log("Item already exists in cart.");

         return cart;
      }

      const cartDoc = doc(db, "shoppingCarts", cart.id);

      const data = removeUndefinedEntriesFromObject(item);
      data.handle = customHandle || item.handle;
      data.name = customName || item.name;
      if (language === "spanish") {
         data.mailerlite_group = data.spanishPDF;
      } else if (language === "english") {
         data.mailerlite_group = data.englishPDF;
      }

      await updateDoc(cartDoc, {
         cartItems: arrayUnion(data),
         subTotal: increment(data.price as number),
         updatedAt: serverTimestamp(),
      });

      const cartItems = [...cart.cartItems, item];
      const cartData = { ...cart, cartItems };

      return new ShoppingCart(cartData);
   } catch (error) {
      console.error("Error adding item to cart: ", error);
      throw new Error("Could not add item to cart.");
   }
};
