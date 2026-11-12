import PageIntro from "@/components/layout/PageIntro";
import Head from "next/head";
import ArtworkImage from "@/components/ui/ArtworkImage";

function About() {
   return (
      <div className="portfolio-content page-content">
         <Head>
            <title>About | Daya Muneton</title>
            <meta name="description" content="Meet Daya Muneton, an artist working at the intersection of Latin music, culture, and emotional education." />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <PageIntro title="About Daya Muneton" description="Artist and entrepreneur" />
         <div className="about-layout">
            <div className="about-image">
               <ArtworkImage
                  src="/DayaAbout1.png" sizes="(min-width: 1280px) 470px, (min-width: 760px) 40vw, 95vw"
                  alt="Daya Muneton"
                  fill
                  priority
                  className="object-cover"
               />
            </div>
            <article className="content-panel reading-flow">
               <h2>Art, music, and emotional education</h2>
               <p>
                  Daya Muneton is an artist who began her journey in 2013 by
                  creating a vast collection of paintings honoring Latin
                  music legends
               </p>
               <p>
                  {
                     "These portraits, cherished by collectors and music lovers around the world, have served as covers on Spotify and as illustrations in books documenting the history of Latin music. This work has been a testament to Daya's commitment to her culture."
                  }
               </p>
               <p>
                  {
                     "However, an emotional crisis within her family led her to lose her inspiration and cease painting for several years. It was a deeply personal experience during this period that led to a renewed sense of purpose. Daya's son's struggle with a lack of interest in life led her to the healing and transformative power of art."
                  }
               </p>
               <p>
                  Recognizing how art could foster empathy and inclusion in
                  the face of the emotional health crisis affecting our
                  community. Daya began to create art that serves a dual
                  purpose. Not only does her art help individuals better
                  understand their emotions, but it also serves as a support
                  system, empowering those in need with essential emotional
                  skills. Each piece Daya creates resonates with a cause
                  close to her heart: providing free emotional education. ​
               </p>
               <p>
                  Thanks to the support of individuals, companies, and
                  institutions, Daya has been able to continue creating art
                  that highlights the significant contributions of Latinos to
                  global culture while fostering emotional understanding
                  within her community.
               </p>
               <p>
                  As an entrepreneur, Daya aspires to elevate her projects to
                  greater heights. She is currently in the process of
                  transforming this concept into a company, with the aim of
                  enabling more growth, wider reach, and benefiting more
                  people around the world.
               </p>
            </article>
         </div>
      </div>
   );
}

export default About;
