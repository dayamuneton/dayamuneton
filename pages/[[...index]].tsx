import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SquareImageHover from "@/components/SquareImageHover";
import Link from "next/link";
import ContactLinks from "@/components/contactLinks";
import SupportMyWork from "@/components/supportMyWork";
import Navbar from "@/components/navbar";

export default function Home() {
   return (
      <main
         className="flex flex-col items-center justify-center min-h-screen text-lg text-gray-300"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <span className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square mt-12 mb-4 drop-shadow-md">
            <Image src="/DayaMunetonB&WArt.jpg" fill alt="Daya Muneton" />
         </span>
         <p>@DayaMuneton</p>
         <p className="my-2">Hi, thank you for supporting by</p>
         {/* <div className="text-center py-2 text-lg text-black bg-gradient-to-r from-[#5bdde5] to-[#034daf] rounded-full w-[90vw] max-w-xl hover:scale-[1.01] drop-shadow-md">
            Click here to support my work
         </div> */}
         <SupportMyWork />
         <p className="mt-8 uppercase">My socials</p>
         <ContactLinks />
         <div className="flex flex-col gap-3 mt-4 mb-20 sm:flex-row">
            <Link
               href="/community"
               className="relative hover:underline drop-shadow-lg group"
            >
               <SquareImageHover
                  src="/StoriesBehindTheSongs.png"
                  alt="Stories behind the songs"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem] overflow-hidden"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>Community</p>
               </span>
            </Link>
            <Link
               href="/shop"
               className="relative hover:underline drop-shadow-lg group"
            >
               <SquareImageHover
                  src="/ShopMyArt.png"
                  alt="Shop My Art"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem] overflow-hidden"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>Shop</p>
               </span>
            </Link>
            <Link
               href="/ageofemotions"
               className="relative drop-shadow-lg group"
            >
               <SquareImageHover
                  src="/MyNotes.png"
                  alt="My Notes"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem] overflow-hidden"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>My</p>
                  <p>Notes</p>
               </span>
            </Link>
         </div>
      </main>
   );
}
