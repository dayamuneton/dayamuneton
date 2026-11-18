import { serverDb } from "@/integrations/firebase/admin";

export const processMembership = async ({ email }: { email: string }) => {
   try {
      const userRef = serverDb().collection("users").doc(email);

      await userRef.set(
         {
            email,
            isMember: true,
         },
         {
            merge: true,
         }
      );

      return;
   } catch (error) {
      throw error;
   }
};
