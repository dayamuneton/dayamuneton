import Link from "next/link";
import type { ReactNode } from "react";
import ArtworkImage from "./ArtworkImage";

export interface ArtworkTile {
   href?: string;
   image: string;
   title: string;
   summary: string;
}

function TileLink({ href, children }: { href?: string; children: ReactNode }) {
   if (!href) return <div className="portfolio-tile">{children}</div>;
   return <Link href={href} className="portfolio-tile" prefetch={false}>{children}</Link>;
}

export default function ArtworkTileGrid({ items }: { items: ArtworkTile[] }) {
   return (
      <ul className="portfolio-tiles">
         {items.map(({ href, image, title, summary }, index) => (
            <li key={title}>
               <TileLink href={href}>
                  <div className="portfolio-tile-image">
                     <ArtworkImage src={image} alt="" fill eager={index === 0}
                        sizes="(min-width: 1140px) 360px, (min-width: 760px) 30vw, (min-width: 560px) 496px, calc(100vw - 32px)"
                        className="object-cover" />
                  </div>
                  <div className="portfolio-tile-caption">
                     <div>
                        <h3>{title}</h3>
                        <p>{summary}</p>
                     </div>
                     {href && <span aria-hidden="true">→</span>}
                  </div>
               </TileLink>
            </li>
         ))}
      </ul>
   );
}
