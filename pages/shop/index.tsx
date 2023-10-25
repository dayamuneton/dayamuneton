import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SquareImageHover from "@/components/SquareImageHover";
import Link from "next/link";
import ContactLinks from "@/components/contactLinks";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
   return (
      <div
         className="flex flex-col items-center justify-center min-h-screen text-lg text-gray-300"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Shop | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <Link href="/about" className="flex flex-col items-center">
            <span className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square mt-12 mb-4 drop-shadow-md">
               <Image src="/DayaMunetonB&WArt.jpg" fill alt="Daya Muneton" />
            </span>
            <p>@DayaMuneton</p>
         </Link>

         <ContactLinks />
         <div className="flex flex-col gap-3 mt-4 sm:flex-row">
            <Link
               href="/shop/heads"
               className="relative hover:underline drop-shadow-lg group bg-gradient-to-r to-[#5bdde5] from-[#034daf] rounded-3xl overflow-hidden"
            >
               <SquareImageHover
                  src="/newshopartcollection.png"
                  alt="Shop My Art Heads"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-lg text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  <p>FORGOTTEN BODIES</p>
                  {/* <p className="text-sm">ART COLLECTION</p> */}
               </span>
            </Link>
            <Link
               href="/shop/memorials"
               className="relative hover:underline drop-shadow-lg group bg-gradient-to-r to-[#5bdde5] from-[#034daf] rounded-3xl overflow-hidden"
            >
               <SquareImageHover
                  src="/newshopcelebrating.png"
                  alt="Shop My Art Bodies"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-lg text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center cursor-pointer">
                  {/* <p>Shop</p> */}
                  <p>CELEBRATING OUR </p>
                  <p>MUSICAL HERITAGE</p>
                  {/* <p>ART COLLECTION</p> */}
               </span>
            </Link>
            <Link
               href="https://ageofemotions.com/"
               className="relative group drop-shadow-lg bg-gradient-to-r to-[#5bdde5] from-[#034daf] rounded-3xl overflow-hidden "
               title="Coming Soon"
               target="_blank"
            >
               <SquareImageHover
                  src="/newshopdayashop.png"
                  alt="Shop My Art Abstracts"
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="group-hover:scale-[1.05]"
               />
               <span className="text-lg text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  {/* <p></p> */}
                  <p>{`DAYA'S SHOP`}</p>
               </span>
            </Link>
         </div>
         {/* <Link
            href="/shop/memorials"
            className=" mt-4 py-3 text-base text-black bg-gradient-to-r from-[#5bdde5] to-[#034daf] rounded-full w-[90vw] max-w-xl drop-shadow-md uppercase font-bold px-4 sm:px-20 text-center"
         >
            Memorials
         </Link> */}
         <Link
            href="/shop/custom"
            className="mb-20 mt-4 py-3 text-base text-black bg-gradient-to-r from-[#5bdde5] to-[#034daf] rounded-full w-[90vw] max-w-xl drop-shadow-md uppercase font-bold px-4 sm:px-20 animate-wiggle text-center"
         >
            Custom Art
         </Link>
      </div>
   );
}
