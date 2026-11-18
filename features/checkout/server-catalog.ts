import { serverDb } from "@/integrations/firebase/admin";
import { isTestSite } from "@/config/site-environment";
import type { Catalog } from "@/features/catalog/types";
import { canonicalOrderItem, type CheckoutSelection, type OrderItem } from "./catalog-items";

export async function loadOrderItems(selections: CheckoutSelection[]): Promise<OrderItem[]> {
   const items: OrderItem[] = [];
   for (const selection of selections) {
      const catalogs: Catalog[] = selection.catalog ? [selection.catalog] : ["products", "pdfproducts"];
      let item: OrderItem | undefined;
      for (const catalog of catalogs) {
         const collection = serverDb().collection(catalog);
         const snapshot = selection.id ? await collection.doc(selection.id).get() : undefined;
         const byHandle = snapshot?.exists ? undefined : (await collection.where("handle", "==", selection.handle).limit(1).get()).docs[0];
         const byId = !snapshot?.exists && !byHandle && /^[\w-]{1,128}$/.test(selection.handle)
            ? await collection.doc(selection.handle).get() : undefined;
         const match = snapshot?.exists ? snapshot : byHandle ?? (byId?.exists ? byId : undefined);
         if (match) {
            item = canonicalOrderItem(match.id, catalog, match.data() ?? {}, selection, !isTestSite);
            break;
         }
      }
      if (!item) throw new Error("This item could not be found.");
      if (items.some((other) => other.id === item.id && other.catalog === item.catalog && other.variantId === item.variantId)) {
         throw new Error("Duplicate checkout item.");
      }
      items.push(item);
   }
   return items;
}
