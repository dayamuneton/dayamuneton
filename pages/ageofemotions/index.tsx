import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
// import SquareImageHover from "@/components/SquareImageHover";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import Testimonies from "@/components/testimonies";

function Ageofemotions() {
   return (
      <div
         className="flex flex-col items-center min-h-screen text-lg text-gray-300"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Age Of Emotions | Daya Muneton</title>
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
         <div className="flex flex-col gap-3 mt-4 sm:flex-row">
            <Link
               href="/ageofemotions/freebies"
               className="flex flex-col items-center  hover:underline drop-shadow-lg group aspect-square w-[80vw] sm:w-[27vw] max-w-[20rem]  bg-gradient-to-r from-[#76e3ee] to-[#4b50c8] rounded-3xl overflow-hidden p-2"
            >
               <span className="aspect-square relative flex h-[30vw] sm:h-[12vw] max-h-[23rem] my-[10%] ">
                  <Image
                     src="/Freebies.png"
                     alt="Stories behind the songs"
                     fill
                     className="group-hover:scale-[1.05] object-cover"
                  />
               </span>
               <span className=" text-black whitespace-nowrap max-w-[25vw] font-bold uppercase flex flex-col items-center mt-2  text-center cursor-pointer">
                  <p className="flex text-base leading-4 text-center">
                     Freebies
                  </p>
               </span>
            </Link>
            <Link
               href="/ageofemotions/colors"
               className="flex flex-col items-center  hover:underline drop-shadow-lg group aspect-square w-[80vw] sm:w-[27vw] max-w-[20rem]  bg-gradient-to-r from-[#76e3ee] to-[#4b50c8] rounded-3xl overflow-hidden p-2"
            >
               <span className="aspect-square relative flex h-[30vw] sm:h-[12vw] max-h-[23rem] my-[10%] ">
                  <Image
                     src="/ArtEmotions.png"
                     alt="Stories behind the songs"
                     fill
                     className="group-hover:scale-[1.05] object-cover"
                  />
               </span>
               <span className="flex flex-col items-center w-full mt-2 font-bold text-center text-black uppercase cursor-pointer ">
                  <p className="flex mb-1 text-base leading-4 text-center">
                     Art Your Emotions
                  </p>
               </span>
            </Link>
            <Link
               href="/ageofemotions/chemistry"
               className="flex flex-col items-center  hover:underline drop-shadow-lg group aspect-square w-[80vw] sm:w-[27vw] max-w-[20rem]  bg-gradient-to-r from-[#76e3ee] to-[#4b50c8] rounded-3xl overflow-hidden p-2"
            >
               <span className="aspect-square relative flex h-[30vw] sm:h-[12vw] max-h-[23rem] my-[10%] ">
                  <Image
                     src="/ChemistryEmotions.png"
                     alt="Stories behind the songs"
                     fill
                     className="group-hover:scale-[1.05] object-cover"
                  />
               </span>
               <span className="flex flex-col items-center mt-2 font-bold text-center text-black uppercase cursor-pointer ">
                  <p className="flex mb-1 text-base leading-4 text-center">
                     Chemistry of Emotions
                  </p>
               </span>
            </Link>
         </div>
         <span className="text-center my-14">
            <p>PDF GUIDES - Digital download</p>
            <p>
               817 Sales | <StarIcon />
               <StarIcon />
               <StarIcon />
               <StarIcon />
               <StarIcon />
            </p>
         </span>
         {/* <div className="bg-gradient-to-r from-[#76e3ee] to-[#4b50c8] rounded-3xl overflow-hidden py-2 px-14 text-center text-[#ECFF04] font-semibold max-w-[95vw] hover:scale-[1.01] cursor-pointer">
            <p className="text-[#231f94] text-2xl font-bold">
               Digital guides for science lovers and visual learners
            </p>
            <span>
               <p>Become a Member and Gain Access to</p>
               <p>Premium Downloads for Only $7.00</p>
            </span>
         </div> */}
         <div className="max-w-lg mt-8 text-center w-[95vw]">
            <p className="mb-4 text-sm font-medium">
               With your purchase, you are not only acquiring a valuable
               product, but you are also actively contributing to the
               realization of my vision for implementing emotional education in
               schools through my program, Age of Emotions. Your support is
               incredibly valuable and deeply appreciated. Together, we can make
               a difference in empowering individuals with essential emotional
               skills.
            </p>
            <p className="font-medium">
               Thank you for being a part of this meaningful endeavor!
            </p>
         </div>
         <span className="relative flex aspect-square h-[7rem]  my-10">
            <Image src="/LogoAgeOfEmotions.png" alt="Logo" fill />
         </span>
         <div className="max-w-lg text-sm text-center mb-14 w-[95vw]">
            <p className="mb-2">
               Welcome to the Age of Emotions: Harnessing the Fusion of Science
               and Art for Personal Transformation.
            </p>
            <p>
               Step into the Era of Emotions, where the convergence of science
               and art help you to discover the boundless possibilities of
               living in a modern, enlightened manner—cultivating
               self-perception, self-knowledge, and achieving coherent results.
               {" It's"} time to embrace a more evolved way of life.
            </p>
         </div>

         <Testimonies />

         <Footer />
      </div>
   );
}

export default Ageofemotions;
