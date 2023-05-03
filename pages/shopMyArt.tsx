import SquareImageHover from "@/components/SquareImageHover";
import Head from "next/head";
import React from "react";

function ShopMyArt() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
         <Head>
            <title>Shop My Art</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="flex gap-4">
            <div className="flex flex-col items-center hover:underline">
               <SquareImageHover
                  src="/HeadLeoSkin.jpg"
                  alt="Leo Man"
                  width="w-[17vw]"
                  scale="hover:scale-[1.03]"
               />
               <p className="text-lg font-semibold uppercase">Head</p>
               <p>All your existance in a skull</p>
            </div>
            <div className="flex flex-col items-center hover:underline">
               <SquareImageHover
                  src="/LeoMujerSelfie.jpg"
                  alt="Mujer Selfie"
                  width="w-[17vw]"
                  scale="hover:scale-[1.03]"
               />
               <p className="text-lg font-semibold uppercase">Body</p>
               <p>You have forgoten your body</p>
            </div>
            <div className="flex flex-col items-center hover:underline">
               <SquareImageHover
                  src="/Flowers.png"
                  alt="Flowers"
                  width="w-[17vw]"
                  scale="hover:scale-[1.03]"
               />
               <p className="text-lg font-semibold uppercase">Abstracts</p>
               <p>Colors of emotions</p>
            </div>
            <div className="flex flex-col items-center hover:underline">
               <SquareImageHover
                  src="/7Preguntas.jpg"
                  alt="7 preguntas"
                  width="w-[17vw]"
                  scale="hover:scale-[1.03]"
               />
               <p className="text-lg font-semibold uppercase">Stationery</p>
               <p>Reflections on yourself</p>
            </div>
         </div>
      </div>
   );
}

export default ShopMyArt;
