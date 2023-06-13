import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import Head from "next/head";
import Image from "next/image";
import React from "react";

function About() {
   return (
      <div className="flex flex-col items-center w-full h-full min-h-screen text-gray-300">
         <Head>
            <title>About | Daya Muneton</title>
            <meta name="description" content="Términos de uso Ama Y Liberate" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col w-full min-h-screen md:flex-row">
            <div className="flex flex-col w-full bg-white pt-14">
               <span className="mx-auto text-black whitespace-nowrap">
                  <p className="text-2xl font-medium -translate-x-4">
                     Daya Muneton
                  </p>
                  <p className="translate-x-4">Artist & Entrepreneur</p>
               </span>
               <span className="relative !aspect-square w-[65%] max-w-[90vh] mx-auto my-auto">
                  <Image
                     src="/DayaAbout1.png"
                     alt="Daya Muneton"
                     fill
                     className="object-cover"
                  />
               </span>
            </div>
            <div className="w-full bg-gradient-to-r from-[#76E3F0] to-[#318791] flex items-center justify-center p-12">
               <div className="flex flex-col max-w-md gap-4 text-[0.75rem] leading-4 text-gray-800">
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
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default About;
