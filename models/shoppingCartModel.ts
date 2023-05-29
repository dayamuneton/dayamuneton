import {
   FieldValue,
   QueryDocumentSnapshot,
   SnapshotOptions,
} from "firebase/firestore";
import { GuiaProduct } from "./guiaProductModel";

export class ShoppingCart {
   id: string;
   customerEmail: string;
   cartItems: any[];
   updatedAt: FieldValue;
   subTotal: number;
   isActive: boolean;
   isProcessed: boolean;

   constructor({
      id,
      customerEmail,
      cartItems,
      updatedAt,
      subTotal,
      isActive,
      isProcessed,
   }: {
      id: string;
      customerEmail: string;
      cartItems: any[];
      updatedAt: FieldValue;
      subTotal: number;
      isActive: boolean;
      isProcessed: boolean;
   }) {
      this.id = id;
      this.customerEmail = customerEmail;
      this.cartItems = cartItems || [];
      this.updatedAt = updatedAt;
      this.subTotal = subTotal || 0;
      this.isActive = isActive || true;
      this.isProcessed = isProcessed ?? false;
   }
}
export const shoppingCartConverter = {
   toFirestore: (shoppingCart: ShoppingCart) => {
      return {
         id: shoppingCart.id,
         customerEmail: shoppingCart.customerEmail,
         cartItems: shoppingCart.cartItems,
         updatedAt: shoppingCart.updatedAt,
         subTotal: shoppingCart.subTotal,
         isActive: shoppingCart.isActive,
         isProcessed: shoppingCart.isProcessed,
      };
   },
   fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
   ) => {
      const data = snapshot.data(options)!;
      return new ShoppingCart({
         id: snapshot.id,
         customerEmail: data.customerEmail,
         cartItems: data.cartItems,
         updatedAt: data.updatedAt,
         subTotal: data.subTotal,
         isActive: data.isActive,
         isProcessed: data.isProcessed,
      });
   },
};
