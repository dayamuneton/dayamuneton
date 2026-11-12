import Head from "next/head";
import Link from "next/link";
import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";
import Navbar from "@/components/navbar/navbar";

const collections = [
   { href: "/shop/heads", image: "/newshopartcollection.png", title: "Forgotten Bodies", summary: "Explore the collection" },
   { href: "/shop/memorials", image: "/newshopcelebrating.png", title: "Celebrating Our Musical Heritage", summary: "Explore the collection" },
   { image: "/newshopdayashop.png", title: "Daya’s Shop", summary: "Coming soon" },
];

export default function Shop() {
   return (
      <div className="portfolio-home">
         <Head>
            <title>Art Shop | Daya Muneton</title>
            <meta name="description" content="Browse Daya Muneton’s original artwork, collections, and custom commissions." />
         </Head>
         <Navbar />
         <main className="portfolio-content">
            <section className="portfolio-intro" aria-labelledby="shop-title">
               <h1 id="shop-title">Art Shop</h1>
               <p className="portfolio-intro-copy">Discover original artwork or commission a piece of your own.</p>
               <div className="portfolio-actions">
                  <Link href="/shop/custom" className="portfolio-button portfolio-button-primary">Custom art commissions</Link>
               </div>
            </section>
            <section className="portfolio-explore" aria-labelledby="collections-heading">
               <h2 id="collections-heading">Collections</h2>
               <ArtworkTileGrid items={collections} />
            </section>
         </main>
      </div>
   );
}
