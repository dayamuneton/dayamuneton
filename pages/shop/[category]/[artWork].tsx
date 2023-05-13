import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
      <div className="flex flex-col items-center min-h-screen">
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
         <div className="flex flex-col items-center justify-center w-full max-w-2xl mt-14 sm:flex-row">
            <div className="flex flex-col-reverse gap-1 sm:flex-row">
               {product.images.length > 1 && (
                  <div className="flex sm:flex-col flex-row gap-1 overflow-x-auto sm:overflow-y-auto sm:custom-scrollbar w-[80vw] sm:w-fit sm:h-[15rem]">
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
               )}
               <span className="relative flex w-[80vw] sm:w-[15rem] h-full aspect-square">
                  <Image
                     src={openImage}
                     alt={product.name}
                     fill
                     className="object-cover"
                  />
               </span>
            </div>
            <div className="flex flex-col h-full gap-2 px-4 mt-4 mb-auto sm:mt-0">
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
               <p>
                  {product.price.toLocaleString("en-US", {
                     style: "currency",
                     currency: "USD",
                  })}
               </p>
               <div className="w-full px-4 mx-2 border-2 border-gray-200 rounded-md">
                  <span className="flex">
                     <p className="mr-1">ic</p>
                     <p>Original work with a certificate of authenticity</p>
                  </span>
                  <span className="flex">
                     <p className="mr-1">ic</p>
                     <p>7-10 day professional delivery</p>
                  </span>
                  <span className="flex">
                     <p className="mr-1">ic</p>
                     <p>Free 14 day returns</p>
                  </span>
               </div>
            </div>
         </div>
         <p className="mb-auto">{product.description}</p>
         <Footer />
      </div>
   );
}

export default ArtWork;
