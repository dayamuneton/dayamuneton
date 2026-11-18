import { dollarsToCents } from "@/integrations/stripe/line-items";
import { isSoldOut } from "@/features/catalog/availability";
import type { Catalog } from "@/features/catalog/types";

export interface CheckoutSelection {
   id?: string;
   handle: string;
   category?: string;
   catalog?: Catalog;
   variantId?: string;
}

export interface OrderItem {
   id: string;
   catalog: Catalog;
   handle: string;
   category: string;
   name: string;
   price: number;
   variantId: string;
   mailerlite_group: string;
   featuredImage: string;
}

export function parseSelections(input: unknown): CheckoutSelection[] {
   if (!Array.isArray(input) || !input.length || input.length > 100) throw new Error("Invalid checkout items.");
   return input.map((value: unknown) => {
      if (!value || typeof value !== "object" || !("handle" in value) || typeof value.handle !== "string") {
         throw new Error("Invalid checkout item.");
      }
      const item = value as Record<string, unknown>;
      const path = value.handle.split("?")[0].split("/").filter(Boolean).map(decodeURIComponent);
      const legacyPath = value.handle.startsWith("/");
      const handle = legacyPath ? path[2] : value.handle;
      if (!handle || handle.length > 200 || /[\/\u0000-\u001f]/.test(handle) || handle === "." || handle === ".." ||
          (legacyPath && (path.length !== 3 || !["shop", "ageofemotions"].includes(path[0])))) {
         throw new Error("Invalid item URL.");
      }
      return {
         handle,
         ...(typeof item.id === "string" && /^[\w-]{1,128}$/.test(item.id) && { id: item.id }),
         ...(typeof item.category === "string" && { category: item.category }),
         ...(legacyPath && { category: path[1], catalog: path[0] === "shop" ? "products" as const : "pdfproducts" as const }),
         ...(!legacyPath && (item.catalog === "products" || item.catalog === "pdfproducts") && { catalog: item.catalog }),
         ...(typeof item.variantId === "string" && { variantId: item.variantId }),
      };
   });
}

export function canonicalOrderItem(id: string, catalog: Catalog, product: Record<string, unknown>, selection: CheckoutSelection, requireDelivery = true): OrderItem {
   const variants = Array.isArray(product.variants) ? product.variants as Record<string, unknown>[] : [];
   const variant = variants.find((entry) => entry.id === selection.variantId);
   if ((selection.category && product.category !== selection.category) ||
       (selection.handle !== product.handle && selection.handle !== id) ||
       (catalog === "products" && isSoldOut(product)) ||
       (catalog === "pdfproducts" && (product.available === 0 || product.externalLink)) ||
       (variants.length > 0 && !variant)) {
      throw new Error("This item is unavailable. Refresh its page and try again.");
   }
   // Existing guide variants describe the language and delivery group. The catalog price is shared.
   const price = Number(product.price);
   if (!(price === 0 || dollarsToCents(price) !== null) || typeof product.name !== "string" || typeof product.category !== "string") {
      throw new Error("This item has invalid checkout information.");
   }
   const images = Array.isArray(product.images) ? product.images : [];
   const group = variant?.mailerlite_group ?? product.mailerlite_group;
   if (requireDelivery && catalog === "pdfproducts" && (typeof group !== "string" || !group)) {
      throw new Error("Guide delivery is unavailable. Please contact Daya.");
   }
   return {
      id, catalog, handle: typeof product.handle === "string" ? product.handle : id,
      category: product.category,
      name: variant ? `${product.name} (${String(variant.title)})` : product.name,
      price, variantId: selection.variantId ?? "", mailerlite_group: typeof group === "string" ? group : "",
      featuredImage: typeof product.featuredImage === "string" ? product.featuredImage : typeof images[0] === "string" ? images[0] : "",
   };
}
