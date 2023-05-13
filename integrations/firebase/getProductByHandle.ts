import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getProductByHandle(
   category: string,
   productHandle: string
) {
   try {
      const q = query(
         collection(db, "products"),
         where("handle", "==", productHandle)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
         console.log("No product document found!");
         return null;
      }

      const docSnap = querySnapshot.docs[0];
      console.log("Product document:", docSnap.data());
      return docSnap.data();
   } catch (error) {
      console.error(error);
      return null;
   }
}
