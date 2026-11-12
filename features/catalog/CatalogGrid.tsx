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
                        sizes="(min-width: 1280px) 380px, (min-width: 800px) 30vw, (min-width: 460px) 46vw, calc(100vw - 32px)"
                        className="object-cover" />
                  </div>
                  <div className="portfolio-tile-caption">
                     <div><h2>{item.name}</h2>{item.soldOut && <p>Sold out</p>}</div>
                     <span aria-hidden="true">→</span>
                  </div>
               </Link>
            </li>
         ))}
      </ul>
   );
}
