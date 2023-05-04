import Head from "next/head";
import Image from "next/image";
import React from "react";

function Shop() {
   return (
      <div
         className="flex flex-col items-center min-h-screen "
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Shop</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <span className="relative overflow-hidden w-full h-[20rem]">
            <Image
               src="/LeopardGlassesGirlSquare.jpg"
               alt="banner"
               fill
               className="object-cover transition-all duration-300 ease-in-out hover:scale-[1.03]"
            />
         </span>
         <h1 className="text-2xl font-bold text-center">
            Custom Art Commisions
         </h1>
         <div className="flex gap-6">
            <div>
               <span className="aspect-square relative overflow-hidden flex h-[17rem] border-8 border-black">
                  <Image
                     src="/ConoceTuCuerpo.png"
                     alt="Digital art"
                     fill
                     className="object-cover hover:scale-[1.03] ease-in-out transition-all duration-300"
                  />
               </span>
               <div>
                  <p>Format: Digital Art</p>
                  <p>Size (30cm x 30cm)</p>
                  <p>300 DPI</p>
               </div>
               <p className="text-[#FF6161] text-xl font-bold">$175 USD</p>
            </div>
            <div>
               <span className="aspect-square relative overflow-hidden flex h-[17rem] border-8 border-black">
                  <Image
                     src="/ConoceTuCuerpo.png"
                     alt="Digital art"
                     fill
                     className="object-cover hover:scale-[1.03] ease-in-out transition-all duration-300"
                  />
               </span>
               <div>
                  <p>Format: Acrylic on canvas</p>
                  <p>Size ${`(30cm x 30cm / 48in x 60in)`}</p>
               </div>
               <span className="text-[#FF6161]  font-bold uppercase flex items-end">
                  <p className="text-xl">$</p>
                  <p className="text-sm">The price depends on your choice</p>
               </span>
            </div>
         </div>
         <span>
            <p>For custom inquires, you can write at info@dayamuneton.com</p>
            <p>or Contact me on WhatsApp here</p>
         </span>
         <button className="bg-[#FF6161] text-lg font-semibold rounded-lg py-3 px-12">
            Daya, I want my portrait
         </button>
         <p>
            With your purchase and custom art commissions, you are helping me
            financially strengthen my current project: ART FOR EMOTIONAL
            EDUCATION. As an entrepreneur, I like to take my projects to high
            levels; I am turning this concept into a company so that it can grow
            more, expand more and benefit more people around the world.
         </p>
         <p className="text-2xl font-bold">THANK YOU!!</p>
         <p>Galeria</p>
         <div className="flex gap-14">
            <span className="aspect-square relative overflow-hidden flex h-[20rem] border-8 border-black">
               <Image
                  src="/LeoMujerSelfie.jpg"
                  alt="Custom Portrait"
                  fill
                  className="object-cover hover:scale-[1.03] ease-in-out transition-all duration-300"
               />
            </span>
            <div className="w-[15rem] text-sm">
               <h2 className="text-3xl font-bold">Custom Portrait Painting</h2>
               <p className="my-4">
                  I will capture this moment of your life, a moment when you are
                  changing your vision and transforming pain into inspiration.
               </p>
               <div className="flex flex-col ">
                  <p>Format: Digital Art</p>
                  <p>Size (30cm x 30cm)</p>
                  <p>300 DPI</p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Shop;
