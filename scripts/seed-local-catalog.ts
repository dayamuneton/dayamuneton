import { doc, terminate, writeBatch } from "firebase/firestore";
import { isLocalSite, localFirebase } from "@/config/site-environment";
import { app } from "@/integrations/firebase/app";
import { db } from "@/integrations/firebase/firestore";
import { demoCatalog } from "@/features/catalog/demo-data";

async function seed() {
   if (!isLocalSite || app.options.projectId !== localFirebase.projectId) {
      throw new Error("The preview catalog requires the local demo Firebase project.");
   }

   const batch = writeBatch(db);
   for (const item of demoCatalog.products) batch.set(doc(db, "products", item.handle), item);
   for (const item of demoCatalog.pdfproducts) batch.set(doc(db, "pdfproducts", item.handle), item);
   await batch.commit();
   console.log("Added seven sample listings to the local demo catalog.");
}

void seed().catch((error: unknown) => {
   console.error(error);
   process.exitCode = 1;
}).finally(() => terminate(db));
