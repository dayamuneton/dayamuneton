import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SquareImageHover from "@/components/SquareImageHover";
import Link from "next/link";
import ContactLinks from "@/components/contactLinks";

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
            <title>Shop My Art</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <span className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square mt-12 mb-4 drop-shadow-md">
            <Image src="/DayaMunetonB&WArt.jpg" fill alt="Daya Muneton" />
         </span>
         <p>@DayaMuneton</p>

         <ContactLinks />
         <div className="flex flex-col gap-3 mt-4 sm:flex-row">
            <div className="relative hover:underline drop-shadow-lg group">
               <SquareImageHover
                  src="/ShopArtHeads.jpg"
                  alt="Shop My Art Heads"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>Stories</p>
                  <p>Behind</p>
                  <p>The Songs</p>
               </span>
            </div>
            <Link
               href="/shopMyArt"
               className="relative hover:underline drop-shadow-lg group"
            >
               <SquareImageHover
                  src="/ShopArtBodies.png"
                  alt="Shop My Art Bodies"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>Shop</p>
                  <p>My</p>
                  <p>Art</p>
               </span>
            </Link>
            <Link
               href="https://www.ageofemotions.com"
               className="relative group drop-shadow-lg"
               target="_blank"
            >
               <SquareImageHover
                  src="/StoriesBehindTheSongs.png"
                  alt="Shop My Art Abstracts"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-xl text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>My</p>
                  <p>Notes</p>
               </span>
            </Link>
         </div>
         <button className="mb-20 mt-4 py-2 text-base text-black bg-gradient-to-r from-[#5bdde5] to-[#034daf] rounded-full w-[90vw] max-w-xl hover:scale-[1.01] drop-shadow-md uppercase font-bold px-4 sm:px-20">
            commemorative art for music legends of latin music culture.
         </button>
      </main>
   );
}
