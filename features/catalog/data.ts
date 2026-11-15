import { isPreviewSite } from "@/config/site-environment";
import { demoCatalog } from "./demo-data";
import type { Catalog, CatalogItem } from "./types";
import { isSoldOut } from "./availability";
import type { DocumentData } from "firebase/firestore/lite";

function summarize(id: string, item: DocumentData, catalog: Catalog): CatalogItem {
   return {
      id,
      handle: item.handle || id,
      name: item.name || "Untitled",
      image: item.featuredImage || item.images?.[0] || null,
      soldOut: catalog === "products" ? isSoldOut(item) : item.available === 0,
   };
}

export async function listCollection(catalog: Catalog, category: string): Promise<CatalogItem[]> {
   if (isPreviewSite) {
      return demoCatalog[catalog].filter((item) => item.category === category)
         .map((item) => summarize(item.handle, item, catalog));
   }

   const [{ collection, getDocs, query, where }, { db }] = await Promise.all([
      import("firebase/firestore/lite"), import("@/integrations/firebase/firestore-lite"),
   ]);
   const results = await getDocs(query(collection(db, catalog), where("category", "==", category)));
   return results.docs.map((item) => summarize(item.id, item.data(), catalog))
      .sort((first, second) => Number(first.soldOut) - Number(second.soldOut) || first.name.localeCompare(second.name));
}

export async function findCatalogItem(catalog: Catalog, category: string, handle: string): Promise<{ id: string; data: DocumentData } | null> {
   if (isPreviewSite) {
      const item = demoCatalog[catalog].find((item) => item.category === category && item.handle === handle);
      return item ? { id: handle, data: item } : null;
   }

   const [{ collection, doc, getDoc, getDocs, limit, query, where }, { db }] = await Promise.all([
      import("firebase/firestore/lite"), import("@/integrations/firebase/firestore-lite"),
   ]);
   const collectionRef = collection(db, catalog);
   const matches = await getDocs(query(collectionRef, where("category", "==", category), where("handle", "==", handle), limit(1)));
   const match = matches.docs[0];
   if (match) return { id: match.id, data: match.data() };

   // Older entries may have only a document ID.
   if (handle.includes("/") || handle === "." || handle === "..") return null;
   const byId = await getDoc(doc(collectionRef, handle));
   return byId.exists() && byId.get("category") === category ? { id: byId.id, data: byId.data() } : null;
}
