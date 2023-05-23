import CommunityColumn from "@/components/communityColumn";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, FormEvent } from "react";
import { Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({ subsets: ["latin"] });

function Community() {
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [anonymously, setAnonymously] = useState(false);

   const sendEmail = async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return;
      try {
         setLoading(true);
         setName("");
         setEmail("");
         setMessage("");
         setAnonymously(false);
         await fetch("/api/send-email", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name,
               email,
               message,
               anonymously,
            }),
         });
         setLoading(false);
      } catch (error) {
         console.error(error);
      }
   };

   const scrollRef = useRef<HTMLFormElement | null>(null);
   const scroll = () => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   return (
      <div
         className="flex flex-col items-center min-h-screen text-lg "
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Community | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col items-center w-full py-6 ">
            <h1 className="px-2 tracking-wider text-xl my-6 font-medium text-[#4642c5] bg-[#edff05] ">
               {"Today's topic:"}
            </h1>
            <span className="mb-2 text-2xl font-bold leading-6 tracking-widest text-center uppercase">
               <p>The stories behind</p>
               <p>the songs</p>
            </span>
            <p className="text-sm font-medium">
               This is not about the story about why a song was written.
            </p>
            <p className="text-sm font-medium">
               This is about your story with your favorite song. ​
            </p>
         </div>
         <div
            className="flex flex-col items-center w-full pb-14 "
            // style={{
            //    backgroundImage:
            //       "radial-gradient(circle at center, #4a23a9, #5cdde5)",
            // }}
         >
            <p className="my-8 text-xl font-medium ">
               Some ideas that help you to write about your Story
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3  max-w-5xl w-[70vw] gap-3 md:w-[95vw] ">
               <CommunityColumn
                  scroll={scroll}
                  className="bg-gradient-to-tr from-[#754af1] to-[#51eace] h-full"
               >
                  <p className="text-base font-medium text-white pt-8 h-[10rem] flex ">
                     ¿ What songs make you feel that love is bad and it is
                     better not to fall in love?
                  </p>
                  <span className="aspect-square relative w-[70%] mx-auto">
                     <Image
                        src="/HeadPhonesCommunity1.png"
                        alt="Headphones Community"
                        fill
                        className="object-cover"
                     />
                  </span>
                  <span className="my-4 text-sm underline">
                     47+ people feel confused about love
                  </span>
                  <p className="mb-auto text-sm">
                     Share what you feel when you listen to that song. ¿Do you
                     feel that love makes you feel weak?​
                  </p>
               </CommunityColumn>
               <CommunityColumn
                  scroll={scroll}
                  className="bg-gradient-to-br to-[#a78ef9] from-[#51eace] h-full"
               >
                  <p className="text-base font-medium text-white pt-8 h-[10rem] flex ">
                     ¿ What song makes you feel that if your loved one goes
                     away, he takes your love with him/her?
                  </p>
                  <span className="aspect-square relative w-[70%] mx-auto">
                     <Image
                        src="/HeadPhonesCommunity2.png"
                        alt="Headphones Community"
                        fill
                        className="object-cover"
                     />
                  </span>
                  <span className="my-4 text-sm underline">
                     39+ people feel emptiness
                  </span>
                  <p className="mb-auto text-sm">
                     Share if you feel an emptiness when you listen to that song
                     that reminds your loved one which is gone ¿What did your
                     partner do to make you feel so much love?
                  </p>
               </CommunityColumn>
               <CommunityColumn
                  scroll={scroll}
                  className="bg-gradient-to-tr from-[#a78ef9] to-[#c7f7db] h-full"
               >
                  <p className="text-base font-medium text-white pt-8 h-[10rem] flex ">
                     ¿ What special song do you feel that a good love heals you,
                     motivates you, makes you feel inspired and excited?
                  </p>
                  <span className="aspect-square relative w-[70%] mx-auto">
                     <Image
                        src="/HeadPhonesCommunity3.png"
                        alt="Headphones Community"
                        fill
                        className="object-cover"
                     />
                  </span>
                  <span className="my-4 text-sm underline">
                     54+ people feel love heels
                  </span>
                  <p className="mb-auto text-sm">
                     Share how good you feel when you listen to that song that
                     reminds you of that love that inspires you, makes you feel
                     strong and brave to move forward. ¿Do you feel that love
                     makes you feel alive?
                  </p>
               </CommunityColumn>
            </div>
         </div>
         <div className="flex flex-col items-center max-w-3xl mb-8 ">
            <div className="bg-gradient-to-r py-6 from-[#754af1] to-[#51eace] my-12 p-2 rounded-3xl drop-shadow">
               <h2 className="mx-auto mb-4 text-2xl font-medium tracking-wider text-center">
                  What is this activity about?
               </h2>
               <div className="flex flex-col sm:flex-row">
                  <span className="!aspect-square !min-w-[15rem] relative  max-w-[70vw] mx-auto mb-8">
                     <Image
                        src="/MujerYourCanvas1.png"
                        alt="Mujer Your Canvas"
                        fill
                     />
                  </span>
                  <div className="flex flex-col px-8">
                     <p>
                        Registration will give you access to share what you
                        feel, you will be part of a collective work of art.
                     </p>
                     <p>
                        The purpose of this activity is for you to discover what
                        has been the cultural impact of music in your life and
                        how it has influenced the way you love
                     </p>
                     <p>¿What does your vision of love look like?</p>
                     <p>
                        Thanks to your participation I can make art and books,
                        based on real stories. ​ ​
                     </p>
                  </div>
               </div>
            </div>
            <form
               onSubmit={sendEmail}
               ref={scrollRef}
               className="flex flex-col max-w-xl px-14 rounded-3xl drop-shadow bg-[#E8E6E6] py-10 text-sm"
            >
               <p className="font-semibold">
                  Write your story here, ( you are allowed to write many
                  different stories with different songs)
               </p>
               <p className="mb-6 text-sm">
                  Publish your name and your country where you live, it is
                  optional, you can write anonymously.
               </p>
               <p>Write your name, email and your answer.</p>
               <input
                  type="text"
                  className="px-4 py-1 mt-4"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
               <input
                  type="email"
                  required
                  className="px-4 py-1 mt-4"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               <label className="flex my-4 font-medium">
                  <input
                     type="checkbox"
                     checked={anonymously}
                     onChange={(e) => setAnonymously(e.target.checked)}
                  />
                  <span className="pl-2 text-sm">
                     <p className="inline mr-1">Send anonymously</p>
                  </span>
               </label>
               <label className="flex my-4 font-medium">
                  <input type="checkbox" required />
                  <span className="pl-2 text-sm">
                     <p className="inline mr-1">
                        I accept the terms and conditions
                     </p>
                     <Link
                        href="/terms-of-use"
                        target="_blank"
                        className="underline"
                     >
                        See Terms of Use
                     </Link>
                  </span>
               </label>
               <p className="mb-6">
                  By checking this box, you are giving Daya the permission to
                  use what you wrote and sent to her email to be published on
                  her artwork, social networks, upcoming projects such as books,
                  video podcasts etc.
               </p>
               <textarea
                  className="h-[7rem]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
               />
               <button className="py-2 my-2 bg-white drop-shadow" type="submit">
                  SEND
               </button>
               <p className="mx-auto">Thank You!</p>
            </form>
            <p className="sm:max-w-xl max-w-[80vw] mt-4 mb-10 text-sm font-medium">
               {`"The information collected in the artistic activities will be used to create art that helps people feel better about life" and also it allowas me to continue doing practices based on the real experiences that we share here in this space"`}
            </p>
            <div className="bg-[#E8E6E6] rounded-3xl drop-shadow  flex flex-col items-center w-full py-6 mb-4">
               <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <span className="flex relative mx-auto min-w-[20rem]  sm:min-w-[15rem] h-[23rem]">
                     <Image
                        src="/LeoMujer.png"
                        fill
                        alt=""
                        className="object-cover object-top"
                     />
                  </span>

                  <div className="flex flex-col max-w-[90vw] gap-2 px-2 sm:max-w-xs">
                     <p className="text-2xl font-semibold">In this community</p>
                     <p className="leading-5">
                        The more we talk about what hurts us, the faster we will
                        find what is hurting us.
                     </p>
                     <p className="text-sm">
                        Expressing what you feel helps you discover how you got
                        to that point that just doesn`t feel right.
                     </p>
                     <p className="text-sm">
                        Learning what other people did to struggle is a way you
                        can help yourself.
                     </p>
                     <p className="text-sm">
                        Do not be indifferent to what you feel and much less be
                        ashamed express what bother you, we are humans learning
                        to live.
                     </p>
                     <p className="text-sm">
                        ¿Do you imagine that you can help someone feel better
                        with your story ?
                     </p>
                     <p className="text-sm">
                        Do not stop!!! Read and share your vision of love.
                     </p>
                  </div>
               </div>
               <p
                  className={`${dancingScript.className} max-w-[95vw] mt-10 mb-4 text-4xl font-bold`}
               >
                  Your story is the art that inspires me.
               </p>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Community;
