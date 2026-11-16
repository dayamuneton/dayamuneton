import Head from "next/head";
import Link from "next/link";
import ContactLinks from "@/components/contactLinks";
import DayaProfile from "@/components/layout/DayaProfile";
import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";
import type { ArtworkTile } from "@/components/ui/ArtworkTileGrid";

const collections: ArtworkTile[] = [
   { href: "/shop/heads", image: "/newshopartcollection.png", title: "Forgotten Bodies" },
   { href: "/shop/memorials", image: "/newshopcelebrating.png", title: "Celebrating Our Musical Heritage", captionPosition: "top" },
   { image: "/newshopdayashop.png", title: "Daya’s Shop", status: "Coming soon" },
];

export default function Shop() {
   return (
      <div className="landing-page">
         <Head>
            <title>Art Shop | Daya Muneton</title>
            <meta name="description" content="Browse Daya Muneton’s original artwork, collections, and custom commissions." />
         </Head>
         <header className="landing-intro">
            <DayaProfile />
            <h1 className="landing-copy">Art Shop</h1>
            <ContactLinks />
         </header>
         <nav aria-label="Collections">
            <ArtworkTileGrid items={collections} variant="shop" />
         </nav>
         <Link href="/shop/custom" className="landing-action landing-custom-link">Custom Art</Link>
      </div>
   );
}
