import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/integrations/firebase/firestore";
import type { CatalogItem } from "./CatalogGrid";
import { isSoldOut } from "./availability";

export type Catalog = "products" | "pdfproducts";

export async function listCollection(catalog: Catalog, category: string): Promise<CatalogItem[]> {
   const items = collection(db, catalog);
   const categoryFilter = where("category", "==", category);
   const results = await getDocs(query(items, categoryFilter));

   return results.docs.map((snapshot) => {
      const item = snapshot.data();
      return {
         id: snapshot.id,
         handle: item.handle || snapshot.id,
         name: item.name || "Untitled",
         image: item.featuredImage || item.images?.[0] || null,
         soldOut: catalog === "products" ? isSoldOut(item) : item.available === 0,
      };
   }).sort((first, second) => Number(first.soldOut) - Number(second.soldOut) || first.name.localeCompare(second.name));
}

export async function findCatalogItem(catalog: Catalog, category: string, handle: string) {
   const collectionRef = collection(db, catalog);
   const matches = await getDocs(query(collectionRef, where("category", "==", category), where("handle", "==", handle), limit(1)));
   if (matches.docs[0]) return matches.docs[0];

   // Older entries may have only a document ID.
   if (handle.includes("/") || handle === "." || handle === "..") return null;
   const byId = await getDoc(doc(collectionRef, handle));
   return byId.exists() && byId.get("category") === category ? byId : null;
}
