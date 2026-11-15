import Head from "next/head";
import ArtworkImage from "@/components/ui/ArtworkImage";
import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";
import Testimonies from "@/components/testimonies";
import DayaProfile from "@/components/layout/DayaProfile";
import { guideCategories } from "@/features/catalog/categories";

const categories = guideCategories.map(({ slug, image, landingTitle }) => ({
   image,
   title: landingTitle,
   href: "/ageofemotions/" + slug,
}));

export default function EmotionalEducation() {
   return (
      <div className="landing-page">
         <Head>
            <title>Age of Emotions | Daya Muneton</title>
            <meta name="description" content="Explore emotional education through downloadable art guides, creative exercises, and workshops." />
         </Head>
         <header className="landing-intro">
            <DayaProfile />
            <div className="landing-copy education-intro">
               <h1>Age of Emotions</h1>
               <p>Inspired by a deeply personal experience, I created these PDF guides as a means to overcome the difficult period when my son grappled with a lack of interest in life.</p>
               <p>Now, I am committed to sharing the invaluable lessons we have learned, offering them to you for guidance and support.</p>
            </div>
         </header>
         <nav aria-label="Guides and workshops">
            <ArtworkTileGrid items={categories} variant="education" />
         </nav>
         <section className="landing-copy education-story reading-flow" aria-labelledby="mission-heading">
            <h2 id="mission-heading">PDF Guides · Digital download</h2>
            <p>817 Sales <span aria-hidden="true">★★★★★</span></p>
            <p>With your purchase, you are not only acquiring a valuable product, but you are also actively contributing to the realization of my vision for implementing emotional education in schools through my program, Age of Emotions. Your support is incredibly valuable and deeply appreciated. Together, we can make a difference in empowering individuals with essential emotional skills.</p>
            <p>Thank you for being a part of this meaningful endeavor!</p>
            <div className="education-logo">
               <ArtworkImage src="/LogoAgeOfEmotions.png" sizes="128px" alt="" fill />
            </div>
            <p>Welcome to the Age of Emotions: Harnessing the Fusion of Science and Art for Personal Transformation.</p>
            <p>Step into the Era of Emotions, where the convergence of science and art helps you discover the possibilities of living in a modern, enlightened manner, cultivating self-perception, self-knowledge, and achieving coherent results. It&apos;s time to embrace a more evolved way of life.</p>
         </section>
         <div className="portfolio-content w-full"><Testimonies /></div>
      </div>
   );
}
