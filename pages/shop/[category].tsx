import Modal from "@/components/ui/modal";
import Navbar from "@/components/navbar/navbar";
import { db } from "@/integrations/firebase/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

const validCategories = [
   {
      category: "heads",
      bannerImg: "/BannerHeads.png",
      title: "Heads",
   },
   {
      category: "bodies",
      title: "Bodies",
      bannerImg: "/Bannerbodies.png",
   },
   {
      category: "abstracts",
      bannerImg: "/BannerAbstracts.png",
      title: "Abstracts",
   },
   {
      category: "memorials",
      bannerImg: "/BannerConmemorativeArt.png",
      title: "Memorials",
      subtitle:
         "A Latin Gift is a mosaic where each piece represents the life experiences of the Latin community through a journey across our musical history.With your purchase or custom art commissions, you are helping me financially strengthen this initiative, directly supporting the continuation and expansion of this unique cultural project",
   },
];

export async function getServerSideProps(context: any) {
   const { category } = context.query;
   const data: any = validCategories.find((item) => item.category === category);
   const galleryContent: any[] = [];
   const galleryQuery = query(
      collection(db, "products"),
      where("category", "==", category),
      orderBy("status", "desc")
   );
   const gallerySnapshot = await getDocs(galleryQuery);
   gallerySnapshot.forEach((doc) => {
      galleryContent.push({
         id: doc.id,
         ...doc.data(),
      });
   });

   data.galleryContent = galleryContent;
   return {
      props: {
         data: data,
      },
   };
}

function Shop({ data }: { data: any }) {
   // const [item, setItem] = useState<any>(null);
   // console.log(data);

   return (
      <div className="flex flex-col items-center min-h-screen overflow-hidden bg-[#ddf2f1]">
         <Head>
            <title>{data.title} | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
            src={data.bannerImg}
            alt="banner"
            className="transition-all duration-300 ease-in-out hover:scale-[1.01]"
         />
         <div className="flex flex-col items-center w-[95vw] max-w-3xl h-full mt-8 ">
            <h1 className="text-3xl font-bold tracking-wider">
               {" "}
               {data.category === "memorials" ? "A LATIN GIFT" : "Gallery"}
            </h1>
            <p className="max-w-sm sm:max-w-[90vw] mb-8 text-sm font-medium text-center">
               {data.category !== "memorials"
                  ? "With your purchase or custom art commissions, you are helping me financially strengthen my current project: ART FOR EMOTIONAL EDUCATION."
                  : "A Latin Gift is a mosaic where each piece represents the life experiences of the Latin community through a journey across our musical history. With your purchase or custom art commissions, you are helping me financially strengthen this initiative, directly supporting the continuation and expansion of this unique cultural project"}

               <p className={data.category === "memorials" ? "" : "hidden"}>
                  Discover more about this project and how you can contribute{" "}
                  <a
                     href="https://unregalolatino.com/"
                     className="text-blue-400 "
                  >
                     click here
                  </a>{" "}
                  for further details.
               </p>
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
               {data.galleryContent?.map((item: any) => (
                  <Link
                     href={`/shop/${item.category}/${
                        encodeURIComponent(item.handle) || item.id
                     }`}
                     key={item.id}
                     className="flex flex-col  sm:w-[30vw] w-[40vw] max-w-[15rem] items-center hover:scale-[1.01] cursor-pointer overflow-hidden"
                  >
                     <span className="relative flex w-full aspect-square">
                        <Image
                           src={item.featuredImage || item.images[0]}
                           alt={item.name}
                           fill
                           className="object-cover"
                        />
                     </span>
                     {item.available === 0 && (
                        <p className="text-xl font-medium text-red-500 uppercase">
                           Sold Out
                        </p>
                     )}
                     <p className="text-lg font-medium capitalize">
                        {item.name}
                     </p>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Shop;
