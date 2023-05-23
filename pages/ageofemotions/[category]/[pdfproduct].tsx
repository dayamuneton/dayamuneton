import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";

export async function getServerSideProps(context: any) {
   const { category, pdfproduct } = context.query;

   const product = await getProductByHandle("pdfproducts", pdfproduct || "");
   if (product === null) {
      return {
         redirect: {
            destination: `/ageofemotions/${category}` || "/ageofemotions",
            permanent: true,
         },
      };
   }

   return {
      props: {
         product: product.data(),
      },
   };
}

function PdfProduct({ product }: { product: any }) {
   const [language, setLanguage] = useState("en");
   const [openImage, setOpenImage] = useState(
      product.featuredImage || product.images[0]
   );
   const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
   };
   return (
      <div className="flex flex-col items-center min-h-screen overflow-hidden bg-[#8d52fe]">
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
         <div className="flex flex-col items-center bg-white justify-center w-[95vw] max-w-4xl  h-full py-8  mt-14 rounded-xl drop-shadow mb-8">
            <div className="flex flex-col md:flex-row">
               <div className="flex flex-col-reverse items-center  gap-1 md:items-start md:flex-row ">
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
               <div className="flex flex-col mt-8 md:mt-0 md:max-w-[20rem] px-4">
                  <h1 className="text-center font-bold text-2xl">
                     {product.name}
                  </h1>
                  <span className="flex gap-1 my-3">
                     <button
                        className={`bg-gray-100 hover:scale-[1.03] px-4 py-1 rounded-full ${
                           language === "en" && "border-2 border-black"
                        }`}
                        onClick={() => handleLanguageChange("en")}
                     >
                        English
                     </button>
                     <button
                        className={`bg-gray-100 hover:scale-[1.03] px-4 py-1 rounded-full ${
                           language === "es" && "border-2 border-black"
                        }`}
                        onClick={() => handleLanguageChange("es")}
                     >
                        Spanish
                     </button>
                  </span>

                  <p className="font-bold text-lg">
                     {product.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                     })}{" "}
                     USD
                  </p>
                  <button className="bg-[#8d52fe] px-4 py-2 rounded-lg text-white hover:scale-[1.03] my-3">
                     Acquire this artwork
                  </button>
                  <p className="capitalize text-center font-bold text-lg mb-3">
                     The Beneficts of Reading and Viewing this Guide
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: product.beneficts }} />
               </div>
            </div>
            <div className="border-t-2 border-gray-100 w-full text-center mt-2 pt-2">
               {product.description}
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default PdfProduct;
