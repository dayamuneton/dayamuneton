import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getProductByHandle(path: string, productHandle: string) {
   try {
      const q = query(
         collection(db, path),
         where("handle", "==", productHandle),
         limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
         console.log("No product document found!");
         return null;
      }

      const docSnap = querySnapshot.docs[0];
      return docSnap;
   } catch (error) {
      console.error(error);
      return null;
   }
}
