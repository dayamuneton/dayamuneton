import Modal from "@/components/ui/modal";
import Navbar from "@/components/navbar/navbar";
import { db } from "@/integrations/firebase/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";
import Footer from "@/components/footer";

const validCategories = [
   {
      category: "freebies",
      title: "Freebies",
      subTitle:
         "All Because We Care! We're Gifting You Free Guides to Help Unleash Your Emotions Through Art.",
   },
   {
      category: "colors",
      title: "Art Your Emotions",
      subTitle:
         "Downloadable Guides to Enhance Body's Perception of Emotions Through Art, Creative Exploration, and Mindful Reflection",
   },
   {
      category: "chemistry",
      title: "Chemistry Of Emotions",
      subTitle:
         "This isn't for those who manage emotions as our ancestors did, unable to explain the biochemical processes of emotions within the body and, thus, attributing them to beliefs. Instead, it's designed for those who embrace the latest scientific knowledge to improve their emotional well-being.",
   },
];

export async function getServerSideProps(context: any) {
   const { category } = context.query;

   const data: any = validCategories.find((item) => item.category === category);

   if (!data) {
      return {
         redirect: {
            destination: "/ageofemotions",
            permanent: true,
         },
      };
   }

   const galleryContent: any[] = [];
   const galleryQuery = query(
      collection(db, "pdfproducts"),
      where("category", "==", category)
      // orderBy("status", "desc")
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

function PDFCategory({ data }: { data: any }) {
   // const [item, setItem] = useState<any>(null);
   // console.log(data);

   return (
      <div
         className="flex flex-col items-center min-h-screen overflow-hidden text-gray-300"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
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
         <Link
            href="/about"
            className="relative flex overflow-hidden w-[7rem] rounded-full aspect-square mt-12 mb-4 drop-shadow-md"
         >
            <Image src="/DayaMunetonB&WArt.jpg" fill alt="Daya Muneton" />
         </Link>
         <span className="flex flex-col items-center max-w-xs text-sm text-center w-[95vw]">
            <p className="text-lg">@DayaMuneton</p>
            <p>Artist</p>
            {/* <p className="my-2">
               Inspired by a deeply personal experience, I created this
               PDF-Guides as a means to overcome the difficult period when my
               son grappled with a lack of interest in life.
            </p>
            <p>
               Now, I am committed to sharing the invaluable lessons we have
               learned, offering them to you for guidance and support. ​
            </p> */}
         </span>
         <div className="flex flex-col items-center w-[95vw] max-w-3xl h-full mt-8 ">
            <h1 className="text-3xl font-bold tracking-wider">{data.title}</h1>
            <p className="max-w-sm mb-8 text-sm font-medium text-center">
               {data.subTitle}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-12 sm:grid-cols-3">
               {data.galleryContent?.map((item: any) => (
                  <Link
                     href={`/ageofemotions/${item.category}/${
                        encodeURIComponent(item.handle) || item.id
                     }`}
                     key={item.id}
                     className="flex flex-col  sm:w-[30vw] w-[40vw] max-w-[15rem] items-center hover:scale-[1.01] cursor-pointer overflow-hidden bg-gradient-to-r from-[#ddf2f1] to-[#d2faf8] drop-shadow-md rounded-lg text-black"
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
                     <p className="px-4 py-1 my-auto text-lg font-medium text-center capitalize">
                        {item.name}
                     </p>
                  </Link>
               ))}
            </div>
            <span className="flex flex-col items-center max-w-xs text-sm text-center w-[95vw]">
               <p className="my-2">
                  Inspired by a deeply personal experience, I created this
                  PDF-Guides as a means to overcome the difficult period when my
                  son grappled with a lack of interest in life.
               </p>
               <p>
                  Now, I am committed to sharing the invaluable lessons we have
                  learned, offering them to you for guidance and support. ​
               </p>
            </span>
         </div>
         <Footer />
      </div>
   );
}

export default PDFCategory;
