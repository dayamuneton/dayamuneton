import Head from "next/head";
import Link from "next/link";
import ArtworkImage from "@/components/ui/ArtworkImage";
import ContactLinks from "@/components/contactLinks";
import Navbar from "@/components/navbar/navbar";
import SupportMyWork from "@/components/supportMyWork";
import HomeTiles from "@/features/home/HomeTiles";

export default function Home() {
   return (
      <div className="portfolio-home">
         <Head>
            <title>Daya Muneton | Art &amp; Emotional Education</title>
            <meta name="description" content="Explore Daya Muneton’s artwork, stories behind the songs, and resources for emotional education." />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <main id="main-content" className="portfolio-content">
            <section aria-labelledby="portfolio-title" className="portfolio-intro">
               <Link href="/about" className="portfolio-portrait" aria-label="About Daya Muneton">
                  <ArtworkImage src="/DayaMunetonB&WArt.jpg" fill sizes="112px" alt="" priority className="object-cover" />
               </Link>
               <h1 id="portfolio-title">Daya Muneton</h1>
               <p className="portfolio-intro-copy">Explore my art and the stories behind it. Every acquisition helps make emotional education freely available.</p>
               <div className="portfolio-actions">
                  <Link href="/shop" className="portfolio-button portfolio-button-primary">Explore the shop</Link>
                  <SupportMyWork />
               </div>
            </section>
            <HomeTiles />
            <footer className="portfolio-socials" aria-label="Social links">
               <p className="text-sm font-semibold">Follow Daya</p>
               <ContactLinks />
            </footer>
         </main>
      </div>
   );
}
