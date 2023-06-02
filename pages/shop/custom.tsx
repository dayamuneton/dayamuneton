import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import {
   Acordion,
   AcordionButton,
   AcordionContent,
   AcordionIcon,
} from "@/components/ui/acordion";
import { sendWaMessageURL } from "@/utils/sendWaMessageURL";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Custom() {
   return (
      <div
         className="flex flex-col items-center min-h-screen overflow-hidden pt-14"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Custom | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <h1 className="mb-4 text-2xl font-bold">Custom Art Commissions</h1>
         <div className="w-[95vw] max-w-xl mb-20">
            <Acordion className="my-2 bg-gradient-to-r to-[#4a23a9] from-[#5cdde5] rounded-lg w-full">
               <AcordionButton className="flex items-center justify-between px-4 py-3 font-semibold text-center">
                  <p className="w-full text-center">Digital Art Format</p>
                  <AcordionIcon className="text-white" />
               </AcordionButton>
               <AcordionContent className="px-4 pb-2 flex flex-col items-center">
                  <div className="flex items-center w-full max-w-md gap-6">
                     <span className="relative flex aspect-square min-w-[10rem] h-[10rem] overflow-hidden">
                        <Image
                           src="/CustomArtPainting.png"
                           fill
                           alt=""
                           className="object-cover"
                        />
                     </span>
                     <div className="max-w-[30ch] text-sm font-medium">
                        <p>Format Digital Art</p>
                        <p>Size (30cm x 30cm)</p>
                        <p>300 DPI</p>
                        <p className="pl-2">● Digital download</p>
                        <p className="pl-2">● Digital file type(s): PNG</p>
                        <p className="text-xl text-white">$175 USD</p>
                     </div>
                  </div>
                  <Link
                     target="_blank"
                     href={sendWaMessageURL(
                        "Daya, I want a custom digital art"
                     )}
                     className="text-center text-white bg-[#4a23a9] px-4 py-2 rounded-lg mt-2 w-full max-w-md"
                  >
                     Daya, I want a custom digital art
                  </Link>
               </AcordionContent>
            </Acordion>
            <Acordion className="my-2 bg-gradient-to-r to-[#4a23a9] from-[#5cdde5] rounded-lg w-full">
               <AcordionButton className="flex items-center justify-between px-4 py-3 font-semibold text-center">
                  <p className="w-full text-center">Acrylic On Canvas</p>
                  <AcordionIcon className="text-white" />
               </AcordionButton>
               <AcordionContent className="px-4 pb-2 flex flex-col items-center">
                  <div className="flex items-center justify-center max-w-md gap-6">
                     <span className="relative flex aspect-square min-w-[10rem] h-[10rem] overflow-hidden">
                        <Image
                           src="/CustomArtPainting.png"
                           fill
                           alt=""
                           className="object-cover"
                        />
                     </span>
                     <div className="text-sm font-medium ">
                        <p>Format Acrylic on canvas</p>
                        <p>Size Custom</p>
                        <p>
                           {
                              '24" x 48"/ 30" x 40" / 30" x 48" / 36" x 36" / 36" x 48" / 48" x 48" / 48" x 60"'
                           }
                        </p>
                        <p className="mt-2 text-xl leading-5 text-white">
                           PRICE DEPENDS ON YOUR CHOISE
                        </p>
                     </div>
                  </div>
                  <Link
                     target="_blank"
                     href={sendWaMessageURL(
                        "Daya, I want a custom art on canvas"
                     )}
                     className="text-center text-white bg-[#4a23a9] px-4 py-2 rounded-lg mt-2 w-full max-w-md"
                  >
                     Daya, I want a custom art on canvas
                  </Link>
               </AcordionContent>
            </Acordion>
            <Acordion className="my-2 bg-gradient-to-r to-[#4a23a9] from-[#5cdde5] rounded-lg w-full">
               <AcordionButton className="flex items-center justify-between px-4 py-3 font-semibold text-center">
                  <p className="w-full leading-5 text-center">Art Prints</p>
                  <AcordionIcon className="text-white" />
               </AcordionButton>
               <AcordionContent className="px-4 pb-2 flex flex-col items-center">
                  <div className="flex items-center justify-center max-w-md gap-6">
                     <span className="relative flex aspect-square min-w-[10rem] h-[10rem] overflow-hidden">
                        <Image
                           src="/CustomArtPainting.png"
                           fill
                           alt=""
                           className="object-cover"
                        />
                     </span>
                     <div className="text-sm font-medium leading-4">
                        <p>
                           Canvas prints are basic inkjet prints that use dye
                           inks, which are not fade resistant and have a
                           longevity of 10-20 years.
                        </p>
                        <p className="mt-2">
                           Giclée, use pigments instead of dyes which are
                           archival and have a longevity of hundreds of years
                        </p>

                        <p className="mt-2 text-xl leading-5 text-white">
                           PRICE DEPENDS ON YOUR CHOISE
                        </p>
                     </div>
                  </div>
                  <Link
                     target="_blank"
                     href={sendWaMessageURL(
                        "Daya, I want a reproduction of your art"
                     )}
                     className="text-center text-white bg-[#4a23a9] px-4 py-2 rounded-lg mt-2 w-full max-w-md"
                  >
                     Daya, I want a reproduction of your art
                  </Link>
                  <Link
                     target="_blank"
                     href={sendWaMessageURL("Daya, I want a custom art print")}
                     className="text-center text-white bg-[#4a23a9] px-4 py-2 rounded-lg mt-2 w-full max-w-md"
                  >
                     Daya, I want a custom art print
                  </Link>
               </AcordionContent>
            </Acordion>
         </div>
         <Footer />
      </div>
   );
}

export default Custom;
