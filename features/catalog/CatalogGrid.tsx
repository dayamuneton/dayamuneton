import Link from "next/link";
import ArtworkImage from "@/components/ui/ArtworkImage";

export interface CatalogItem {
   id: string;
   handle: string;
   name: string;
   image: string | null;
   soldOut: boolean;
}

export default function CatalogGrid({ items, basePath }: { items: CatalogItem[]; basePath: string }) {
   return (
      <ul className="catalog-grid" aria-label="Collection items">
         {items.map((item, index) => (
            <li key={item.id}>
               <Link href={basePath + "/" + encodeURIComponent(item.handle)} className="portfolio-tile" prefetch={false}>
                  <div className="catalog-image">
                     <ArtworkImage src={item.image} alt="" fill eager={index === 0}
                        sizes="(min-width: 800px) 240px, (min-width: 640px) 31vw, 46vw"
                        className="object-cover" />
                  </div>
                  <div className="portfolio-tile-caption">
                     <h2>{item.name}</h2>
                     {item.soldOut && <p className="text-danger font-semibold">Sold out</p>}
                  </div>
               </Link>
            </li>
         ))}
      </ul>
   );
}
