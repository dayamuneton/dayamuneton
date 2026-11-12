import Head from "next/head";
import PageIntro from "@/components/layout/PageIntro";
import ArtworkImage from "@/components/ui/ArtworkImage";
import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";
import Testimonies from "@/components/testimonies";
import { guideCategories } from "@/features/catalog/categories";

const categories = guideCategories.map(({ slug, ...category }) => ({
   ...category,
   href: "/ageofemotions/" + slug,
}));

export default function EmotionalEducation() {
   return (
      <div className="portfolio-content page-content">
         <Head>
            <title>Age of Emotions | Daya Muneton</title>
            <meta name="description" content="Explore emotional education through downloadable art guides, creative exercises, and workshops." />
         </Head>
         <PageIntro title="Age of Emotions" description="Explore what you feel through art, science, and mindful reflection." />
         <section className="portfolio-explore" aria-labelledby="guides-heading">
            <h2 id="guides-heading">Guides and workshops</h2>
            <ArtworkTileGrid items={categories} />
         </section>
         <section className="content-panel education-story" aria-labelledby="mission-heading">
            <div className="education-logo">
               <ArtworkImage src="/LogoAgeOfEmotions.png" sizes="128px" alt="" fill />
            </div>
            <div className="reading-flow">
               <h2 id="mission-heading">Why I started Age of Emotions</h2>
               <p>I created these guides during a difficult time for my family, when my son was struggling with a lack of interest in life. I wanted to share what we learned and offer others guidance through art.</p>
               <p>Purchases support my goal of bringing emotional education into schools through Age of Emotions. Thank you for helping me make that possible.</p>
            </div>
         </section>
         <Testimonies />
      </div>
   );
}
