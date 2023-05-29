import { db } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ShoppingCart } from "../../../models/shoppingCartModel";

export const createShoppingCart = async (email: string) => {
   try {
      const cartData = {
         id: "",
         customerEmail: email,
         cartItems: [],
         updatedAt: serverTimestamp(),
         isActive: true,
      };

      const cartsCollection = collection(db, "shoppingCarts");

      const cartDoc = await addDoc(cartsCollection, cartData);

      return new ShoppingCart({
         ...cartData,
         id: cartDoc.id,
         subTotal: 0,
         isActive: true,
         isProcessed: false,
      });
   } catch (error) {
      console.error("Error creating shopping cart: ", error);
      throw new Error("Could not create shopping cart.");
   }
};
