import Link from "next/link";
import type { ReactNode } from "react";
import ArtworkImage from "./ArtworkImage";

export interface ArtworkTile {
   href?: string;
   image: string;
   title: string;
   status?: string;
   captionPosition?: "top";
}

function TileLink({ href, children }: { href?: string; children: ReactNode }) {
   if (!href) return <div className="portfolio-tile">{children}</div>;
   return <Link href={href} className="portfolio-tile" prefetch={false}>{children}</Link>;
}

export default function ArtworkTileGrid({ items, variant }: {
   items: ArtworkTile[];
   variant: "home" | "shop" | "education";
}) {
   const sizes = variant === "education"
      ? "(min-width: 1200px) 145px, (min-width: 640px) 12vw, 35vw"
      : "(min-width: 1200px) 320px, (min-width: 640px) 27vw, (min-width: 400px) 320px, 80vw";
   return (
      <ul className="portfolio-tiles" data-variant={variant}>
         {items.map(({ href, image, title, status, captionPosition }) => (
            <li key={title} data-caption={captionPosition}>
               <TileLink href={href}>
                  <div className="portfolio-tile-image">
                     <ArtworkImage src={image} alt="" fill sizes={sizes} className="object-cover" />
                  </div>
                  <span className="portfolio-tile-label">
                     <span>{title}</span>
                     {status && <small>{status}</small>}
                  </span>
               </TileLink>
            </li>
         ))}
      </ul>
   );
}
