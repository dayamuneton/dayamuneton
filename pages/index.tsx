import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ContactLinks from "@/components/contactLinks";
import Navbar from "@/components/navbar/navbar";
import SupportMyWork from "@/components/supportMyWork";
import HomeTiles from "@/features/home/HomeTiles";

export default function Home() {
   return (
      <main
         className="flex flex-col items-center justify-center h-full min-h-screen text-lg text-gray-300"
         style={{ backgroundImage: "radial-gradient(circle at center, #4a23a9, #5cdde5)" }}
      >
         <Head>
            <title>Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta name="keywords" content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <Link href="/about" className="flex flex-col items-center">
            <span className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square mt-12 mb-4 drop-shadow-md">
               <Image src="/DayaMunetonB&WArt.jpg" fill sizes="112px" alt="Daya Muneton" />
            </span>
            <p>@DayaMuneton</p>
         </Link>
         <div className="my-6 w-[95vw] max-w-md text-center text-base">
            <p>Welcome to my art gallery!</p>
            <p>Each art acquisition supports free emotional education.</p>
            <p>{"Together, we're empowering individuals through art."}</p>
            <p>Thanks for joining this transformative journey.</p>
         </div>
         <SupportMyWork />
         <p className="mt-8 uppercase">My socials</p>
         <ContactLinks />
         <HomeTiles />
      </main>
   );
}
