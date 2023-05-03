import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SquareImageHover from "@/components/SquareImageHover";
import Link from "next/link";

export default function Home() {
   return (
      <main className="flex flex-col items-center justify-center min-h-screen">
         <Head>
            <title>Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         {/* <span className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square">
            <Image src="/DayaMuneton.png" fill alt="Daya Muneton" />
         </span> */}
         <p>@DayaMuneton</p>
         <p>Hi, thank you for supporting by</p>
         <button className="py-2 text-lg text-white bg-green-800 rounded-full px-14">
            Click here to support my work
         </button>
         <p className="mt-8">My socials</p>
         <p>Icons</p>
         <div>
            <button>image</button>
            <button>image</button>
            <button>image</button>
         </div>
         <div className="flex gap-3">
            <div className="hover:underline">
               <SquareImageHover
                  src="/AmericaGirl.png"
                  alt="America Girl"
                  width="w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="hover:scale-[1.05]"
               />
               <p className="text-lg whitespace-nowrap max-w-[25vw] font-bold uppercase">
                  Stories behind the...
               </p>
            </div>
            <Link href="/shopMyArt" className="hover:underline">
               <SquareImageHover
                  src="/Flowers.png"
                  alt="Flowers"
                  width="w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="hover:scale-[1.05]"
               />
               <p className="text-lg whitespace-nowrap max-w-[25vw] font-bold uppercase">
                  Shop my art
               </p>
            </Link>
            <div className="hover:underline">
               <SquareImageHover
                  src="/YellowBox.png"
                  alt="yellow box"
                  width="w-[27vw] max-w-[20rem] rounded-[2rem]"
                  scale="hover:scale-[1.05]"
               />
               <p className="text-lg whitespace-nowrap max-w-[25vw] font-bold uppercase">
                  Study with me about...
               </p>
            </div>
         </div>
      </main>
   );
}
