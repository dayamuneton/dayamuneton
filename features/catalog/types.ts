export type Catalog = "products" | "pdfproducts";

export interface CatalogItem {
   id: string;
   handle: string;
   name: string;
   image: string | null;
   soldOut: boolean;
}
