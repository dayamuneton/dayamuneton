import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";

const collections = [
   { href: "/shop/heads", image: "/newshopartcollection.png", title: "Forgotten Bodies", summary: "Explore the collection" },
   { href: "/shop/memorials", image: "/newshopcelebrating.png", title: "Celebrating Our Musical Heritage", summary: "Explore the collection" },
   { image: "/newshopdayashop.png", title: "Daya’s Shop", summary: "Coming soon" },
];

export default function Shop() {
   return (
      <div className="portfolio-content page-content">
         <Head>
            <title>Art Shop | Daya Muneton</title>
            <meta name="description" content="Browse Daya Muneton’s original artwork, collections, and custom commissions." />
         </Head>
         <PageIntro title="Art Shop" description="Discover original artwork or commission a piece of your own.">
            <Link href="/shop/custom" className="portfolio-button portfolio-button-primary">Custom art commissions</Link>
         </PageIntro>
         <section className="portfolio-explore" aria-labelledby="collections-heading">
            <h2 id="collections-heading">Collections</h2>
            <ArtworkTileGrid items={collections} />
         </section>
      </div>
   );
}
