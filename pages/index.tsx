import Head from "next/head";
import ContactLinks from "@/components/contactLinks";
import SupportMyWork from "@/components/supportMyWork";
import DayaProfile from "@/components/layout/DayaProfile";
import HomeTiles from "@/features/home/HomeTiles";

export default function Home() {
   return (
      <div className="landing-page">
         <Head>
            <title>Daya Muneton | Art &amp; Emotional Education</title>
            <meta name="description" content="Explore Daya Muneton’s artwork, stories behind the songs, and resources for emotional education." />
         </Head>
         <h1 className="sr-only">Daya Muneton</h1>
         <DayaProfile />
         <div className="home-welcome">
            <p>Welcome to my art gallery!</p>
            <p>Each art acquisition supports free emotional education.</p>
            <p>Together, we&apos;re empowering individuals through art.</p>
            <p>Thanks for joining this transformative journey.</p>
         </div>
         <SupportMyWork />
         <section className="home-socials" aria-labelledby="home-socials-heading">
            <h2 id="home-socials-heading">My socials</h2>
            <ContactLinks />
         </section>
         <HomeTiles />
      </div>
   );
}
