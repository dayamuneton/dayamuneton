import ArtworkImage from "@/components/ui/ArtworkImage";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CatalogKind } from "./catalogConfig";

interface ProductSummary {
   id: string;
   name?: string;
   category?: string;
   price?: number;
   images?: string[];
   featuredImage?: string;
}

export default function AdminCatalogList({ products, type }: { products: ProductSummary[]; type: CatalogKind }) {
   return (
      <ul className="admin-list" aria-label={type}>
         {products.map((product) => (
            <li key={product.id}>
               <Link href={`/admin/${type}/${encodeURIComponent(product.id)}`} prefetch={false} className="admin-list-row">
                  <span className="admin-thumb">
                     <ArtworkImage src={product.featuredImage || product.images?.[0]} fill sizes="48px" className="object-cover" alt="" />
                  </span>
                  <span><strong>{product.name || "Untitled"}</strong><span className="block text-sm text-muted">{product.category || "Uncategorized"}</span></span>
                  <span className="admin-price">{typeof product.price === "number" ? formatCurrency(product.price) : "—"}</span>
               </Link>
            </li>
         ))}
      </ul>
   );
}
