import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

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
         <div className="flex flex-col items-center justify-center w-full mt-14 sm:flex-row">
            <div>
               <span className="relative flex w-[15rem] h-full aspect-square">
                  <Image src={product.images[0]} alt={product.name} fill />
               </span>

               {product.images.length > 1 && (
                  <div className="flex">
                     {product.images.map((image: string) => (
                        <span
                           key={image}
                           className="relative w-[4rem] h-full aspect-square"
                        >
                           <Image src={image} alt={product.name} fill />
                        </span>
                     ))}
                  </div>
               )}
            </div>
            <div>
               <h1 className="text-3xl font-bold">{product.name}</h1>
               <p>{product.price}</p>
            </div>
         </div>
         <p className="mb-auto">{product.description}</p>
         <Footer />
      </div>
   );
}

export default ArtWork;
