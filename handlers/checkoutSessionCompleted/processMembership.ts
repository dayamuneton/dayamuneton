import { db } from "@/integrations/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export const processMembership = async ({ email }: { email: string }) => {
   try {
      const userRef = doc(db, "users", email);

      await setDoc(
         userRef,
         {
            email,
            isMember: true,
         },
         {
            merge: true,
         }
      );

      console.log("log ", `nuevo miembro ${email}`);

      return;
   } catch (error) {
      console.error(error);
      throw error;
   }
};
