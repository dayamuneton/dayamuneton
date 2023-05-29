import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class GuiaOrder {
   id: string;
   email: string;
   name: string;
   type: string;
   cartItems: any[];
   isProcessed: boolean;

   constructor({
      id,
      email,
      name,
      type,
      cartItems,
      isProcessed,
   }: {
      id: string;
      email: string;
      name: string;
      type: string;
      cartItems: any[];
      isProcessed: boolean;
   }) {
      this.id = id || "";
      this.email = email || "";
      this.name = name || "";
      this.type = type || "";
      this.cartItems = cartItems || [];
      this.isProcessed = isProcessed || false;
   }
}
export const guiaOrderConverter = {
   toFirestore: (guiaOrder: GuiaOrder) => {
      return {
         email: guiaOrder.email,
         name: guiaOrder.name,
         type: guiaOrder.type,
         cartItems: guiaOrder.cartItems,
         isProcessed: guiaOrder.isProcessed,
         id: guiaOrder.id,
      };
   },
   fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
   ) => {
      const data = snapshot.data(options);
      return new GuiaOrder({
         id: data.id,
         email: data.email,
         name: data.name,
         type: data.type,
         cartItems: data.cartItems,
         isProcessed: data.isProcessed,
      });
   },
};
