import AcquireGuide from "@/components/acquireGuide";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import { createPdfsCheckout } from "@/handlers/orders/createPdfsCheckout";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { addItemToCart } from "@/integrations/firebase/shoppingCart/addItemToShoppingCart";
import { useShop } from "@/context/shopContext";
import { useAuth } from "@/context/authContext";
import { removeCartItem } from "@/integrations/firebase/shoppingCart/removeItemFromShoppingCart";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
   const { category, pdfproduct } = context.query;

   const product = await getProductByHandle(
      "pdfproducts",
      decodeURIComponent(pdfproduct) || ""
   );
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
   const router = useRouter();
   const { shoppingCart } = useShop();
   const { currentUser } = useAuth();
   const [language, setLanguage] = useState(
      (router.query.lang as string) || "english"
   );
   const [openImage, setOpenImage] = useState(
      product.featuredImage || product.images[0]
   );
   const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
   };

   return (
      <div
         className="flex flex-col items-center min-h-screen overflow-hidden "
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
         <div className="flex flex-col items-center bg-white justify-center w-[95vw] max-w-4xl  h-full py-8  mt-14 rounded-xl drop-shadow mb-8 px-4">
            <div className="flex flex-col md:flex-row">
               <div>
                  <div className="flex flex-col-reverse items-center gap-1 md:items-start md:flex-row ">
                     <div
                        className={`${
                           product.images.length > 1 ? "flex" : "hidden"
                        } flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto custom-scrollbar max-w-[90vw] md:w-fit md:h-[15vw]`}
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
                  <div className="px-6 my-4">
                     <p className="mb-2 text-xl font-bold ">{product.name}</p>
                     <div>
                        <p className="text-base">{product.description}</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col mt-8 md:mt-0 md:max-w-[20rem] px-4">
                  <h1 className="text-2xl font-bold text-center">
                     {product.name}
                  </h1>
                  <span className="flex gap-1 my-3">
                     <button
                        className={`bg-gray-100 hover:scale-[1.03] px-4 py-1 rounded-full ${
                           language === "english" && "border-2 border-black"
                        }`}
                        onClick={() => {
                           router.replace(
                              {
                                 pathname: router.pathname,
                                 query: { ...router.query, lang: "english" },
                              },
                              undefined,
                              {
                                 shallow: true,
                              }
                           );
                           handleLanguageChange("english");
                        }}
                     >
                        English
                     </button>
                     <button
                        className={`bg-gray-100 hover:scale-[1.03] px-4 py-1 rounded-full ${
                           language === "spanish" && "border-2 border-black"
                        }`}
                        onClick={() => {
                           router.replace(
                              {
                                 pathname: router.pathname,
                                 query: { ...router.query, lang: "spanish" },
                              },
                              undefined,
                              { shallow: true }
                           );
                           handleLanguageChange("spanish");
                        }}
                     >
                        Spanish
                     </button>
                  </span>

                  <p className="text-lg font-bold">
                     {product.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                     })}
                     USD
                  </p>
                  <AcquireGuide product={product} language={language} />

                  <button
                     className="w-full px-4 py-2 text-lg border-2 border-[#4a23a9] text-[#4a23a9] rounded-md hover:scale-[1.01]"
                     hidden={
                        !currentUser ||
                        shoppingCart?.cartItems?.some(
                           (item) => item.handle === router.asPath
                        )
                     }
                     onClick={() =>
                        addItemToCart(
                           shoppingCart,
                           product,
                           currentUser.email,
                           router.asPath,
                           `${product.name} (${language})`,
                           language
                        )
                     }
                     title="Original Piece Sold Out"
                  >
                     Add To Cart
                  </button>
                  <button
                     className="w-full px-4 py-2 text-lg border-2 border-[#4a23a9] text-[#4a23a9] rounded-md hover:scale-[1.01]"
                     hidden={
                        !currentUser ||
                        !shoppingCart?.cartItems?.some(
                           (item) => item.handle === router.asPath
                        )
                     }
                     onClick={() =>
                        removeCartItem(shoppingCart, product, router.asPath)
                     }
                     title="Original Piece Sold Out"
                  >
                     Remove from Cart
                  </button>
                  <p className="mb-3 text-lg font-bold text-center capitalize">
                     The Beneficts of Reading and Viewing this Guide
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: product.beneficts }} />
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default PdfProduct;
