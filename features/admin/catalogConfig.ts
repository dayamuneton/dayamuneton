export type CatalogKind = "paintings" | "guides";
export const catalogCollections = { paintings: "products", guides: "pdfproducts" } as const;
export const catalogLabels = { paintings: "painting", guides: "guide" } as const;
