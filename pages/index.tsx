import Head from "next/head";
import Link from "next/link";
import ArtworkImage from "@/components/ui/ArtworkImage";
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

         <section aria-labelledby="portfolio-title" className="home-hero">
            <div className="home-hero-art" aria-hidden="true">
               <ArtworkImage src="/StoriesBehindTheSongs.png" fill sizes="(min-width: 680px) 62vw, 77vw" alt="" priority />
            </div>
            <div className="home-hero-content">
               <Link href="/about" className="portfolio-portrait" aria-label="About Daya Muneton">
                  <ArtworkImage src="/DayaMunetonB&WArt.jpg" fill sizes="(min-width: 1400px) 168px, (min-width: 867px) 12vw, 104px" alt="" eager className="object-cover" />
               </Link>
               <h1 id="portfolio-title">Daya Muneton</h1>
               <p className="portfolio-intro-copy">Art, stories, and emotional education.</p>
               <div className="portfolio-actions">
                  <Link href="/shop" className="portfolio-button portfolio-button-primary">Explore the shop</Link>
                  <SupportMyWork />
               </div>
            </div>
         </section>
         <HomeTiles />
      </div>
   );
}
