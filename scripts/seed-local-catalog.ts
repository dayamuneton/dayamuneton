import { doc, terminate, writeBatch } from "firebase/firestore";
import { isLocalSite, localFirebase } from "@/config/site-environment";
import { app } from "@/integrations/firebase/app";
import { db } from "@/integrations/firebase/firestore";

const paintings = [
   { category: "heads", name: "Head study", image: "/StoriesBehindTheSongs.png" },
   { category: "bodies", name: "Figure study", image: "/ShopMyArt.png" },
   { category: "abstracts", name: "Color study", image: "/MyNotes.png" },
   { category: "memorials", name: "Portrait study", image: "/newshopcelebrating.png" },
];
const guides = [
   { category: "freebies", name: "An introduction to art and emotions", image: "/Freebies.png", price: 0 },
   { category: "colors", name: "Explore emotions through color", image: "/ArtEmotions.png", price: 7 },
   { category: "chemistry", name: "How emotions work", image: "/ChemistryEmotions.png", price: 7 },
];

async function seed() {
   if (!isLocalSite || app.options.projectId !== localFirebase.projectId) {
      throw new Error("The preview catalog requires the local demo Firebase project.");
   }

   const batch = writeBatch(db);
   for (const { category, name, image } of paintings) {
      const handle = "preview-" + category;
      batch.set(doc(db, "products", handle), {
         handle, category, name: "Demo · " + name, images: [image], price: 100, status: 1, available: 1,
         date: 20261112, description: "Sample listing for the local portfolio preview.", techniques: [],
      });
   }
   for (const { category, name, image, price } of guides) {
      const handle = "preview-" + category;
      batch.set(doc(db, "pdfproducts", handle), {
         handle, category, name: "Demo · " + name, images: [image], price, date: 20261112,
         description: "Sample guide for the local portfolio preview.", variants: [],
      });
   }

   await batch.commit();
   console.log("Added seven sample listings to the local demo catalog.");
}

void seed().catch((error: unknown) => {
   console.error(error);
   process.exitCode = 1;
}).finally(() => terminate(db));
