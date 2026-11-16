import Head from "next/head";
import ContactLinks from "@/components/contactLinks";
import SupportMyWork from "@/features/home/SupportMyWork";
import DayaProfile from "@/components/layout/DayaProfile";
import HomeTiles from "@/features/home/HomeTiles";

export default function Home() {
   return (
      <div className="landing-page home-page">
         <Head>
            <title>Daya Muneton | Art &amp; Emotional Education</title>
            <meta name="description" content="Explore Daya Muneton’s artwork, stories behind the songs, and resources for emotional education." />
         </Head>
         <header className="landing-intro">
            <DayaProfile />
            <div className="landing-copy home-welcome">
               <h1>Welcome to my art gallery!</h1>
               <p>Each art acquisition supports free emotional education.</p>
               <p>Together, we&apos;re empowering individuals through art.</p>
               <p>Thanks for joining this transformative journey.</p>
            </div>
         </header>
         <SupportMyWork />
         <section className="home-socials" aria-labelledby="home-socials-heading">
            <h2 id="home-socials-heading">My socials</h2>
            <ContactLinks />
         </section>
         <HomeTiles />
      </div>
   );
}
