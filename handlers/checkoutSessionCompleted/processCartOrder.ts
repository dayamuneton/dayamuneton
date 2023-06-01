import { guiaOrderConverter } from "@/models/guiasOrderModel";
import { db } from "@/integrations/firebase/firebaseConfig";
import { subscribeCustomerToGroups } from "@/integrations/mailerlite/subscribeCustomerToGroups";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const processCartOrder = async ({ orderId }: { orderId: string }) => {
   try {
      const orderDoc = doc(db, "orders", orderId).withConverter(
         guiaOrderConverter
      );
      await updateDoc(orderDoc, {
         isProcessed: "inProcess",
      });

      const orderSnapshot = await getDoc(orderDoc);

      if (!orderSnapshot.exists()) return;

      const order = orderSnapshot.data();
      const email = order.email;
      const name = order.name;

      const mailerlite_groups = order.cartItems.map(
         (item) => item.mailerlite_group
      );

      await subscribeCustomerToGroups(email, name, mailerlite_groups);

      await updateDoc(orderDoc, {
         isProcessed: true,
      });

      console.log("log", "pdfs order processed", orderId, order);
   } catch (error) {
      console.error("Error processing pdfs order: ", error);
      throw new Error("Could not process cart order.");
   }
};
