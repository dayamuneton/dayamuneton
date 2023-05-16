import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MakeAnOffer from "@/components/makeAnOffer";
import ImageIcon from "@mui/icons-material/Image";

export async function getServerSideProps(context: any) {
   const { category, artWork } = context.query;

   const product = await getProductByHandle(category || "", artWork || "");
   if (product === null) {
      return {
         redirect: {
            destination: `/shop/${category}` || "/shop",
            permanent: true,
         },
      };
   }

   return {
      props: {
         product,
      },
   };
}

function ArtWork(props: { product: any }) {
   const { product } = props;
   const [openImage, setOpenImage] = useState(product.featuredImage);

   return (
      <div
         className="flex flex-col items-center min-h-screen"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>{product.name} | Daya Muneton</title>
            <meta name="description" content={product.description} />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col items-center justify-center w-[95vw] max-w-5xl bg-white py-6 md:pt-8 px-8 md:items-start md:flex-row mt-14 overflow-hidden rounded-3xl drop-shadow-md mb-4">
            <div className="flex flex-col items-center justify-center w-full">
               <div className="flex flex-col-reverse items-center gap-1 md:items-start md:flex-row ">
                  <div
                     className={`${
                        product.images.length > 1 ? "flex" : "hidden"
                     } flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto custom-scrollbar max-w-[90vw] md:w-fit md:h-[35vw]`}
                  >
                     {product.images.map((image: string) => (
                        <span
                           key={image}
                           onClick={() => setOpenImage(image)}
                           className="relative min-w-[3.5rem] !max-w-[3.5rem] min-h-[3.5rem] aspect-square cursor-pointer"
                        >
                           <Image
                              src={image}
                              alt={product.name}
                              fill
                              className="object-cover"
                           />
                        </span>
                     ))}
                  </div>

                  <span className="relative flex w-[85vw] h-[85vw] max-w-[30rem] md:w-[35vw] md:h-[35vw]   max-h-[30rem] aspect-square">
                     <Image
                        src={openImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                     />
                  </span>
               </div>
               <div className="flex flex-col w-full gap-2 py-3 mt-2 border-t-2 border-gray-200 md:flex-row">
                  <p className="min-w-[9rem] text-xl font-bold">
                     {product.name}
                  </p>
               </div>

               <div className="flex flex-col w-full gap-2 py-6 border-t-2 border-gray-200 md:flex-row">
                  <p className="min-w-[9rem] text-xl font-bold">
                     About the art work
                  </p>
                  <p>{product.description}</p>
               </div>
               <div className="flex flex-col w-full gap-2 py-6 mt-2 border-t-2 border-gray-200 md:flex-row">
                  <p className="w-[17rem] text-xl font-bold">
                     Shipping Information
                  </p>
                  <p>{product.shippingInformation}</p>
               </div>
            </div>
            <div className="flex flex-col w-full gap-2 mt-4 mb-auto md:pl-8 md:mt-0">
               <h1 className="mt-2 text-2xl font-bold capitalize">
                  {product.name}
               </h1>
               <div className="flex">
                  {product.techniques.map((technique: string) => (
                     <p
                        key={technique}
                        className="px-2 py-1 mr-1 capitalize bg-gray-100 rounded"
                     >
                        {technique}
                     </p>
                  ))}
               </div>
               <p className="text-2xl font-semibold">
                  {product.price.toLocaleString("en-US", {
                     style: "currency",
                     currency: "USD",
                  })}
               </p>
               <button
                  className="w-full px-4 py-2 mt-4 text-lg text-white bg-[#4a23a9] rounded-md cursor-not-allowed"
                  disabled
                  title="Original Piece Sold Out"
               >
                  Acquire this artwork
               </button>
               <MakeAnOffer initialPrice={product.price} />

               <div className="w-full px-4 py-4 mb-4 border-2 border-gray-200 rounded-md">
                  <span className="flex items-center mb-2">
                     <ImageIcon className="mr-1 text-gray-700" />
                     <p>Limited Edition</p>
                  </span>
                  <span className="flex items-center mb-2">
                     <VerifiedIcon className="mr-1 text-gray-700" />
                     <p>Original work with a certificate of authenticity</p>
                  </span>
                  <span className="flex items-center mb-2">
                     <LocalShippingIcon className="mr-1 text-gray-700" />
                     <p>7-10 day professional delivery</p>
                  </span>
                  <span className="flex items-center mb-2">
                     <KeyboardReturnIcon className="mr-1 text-gray-700" />
                     <p>Free 14 day returns</p>
                  </span>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default ArtWork;
