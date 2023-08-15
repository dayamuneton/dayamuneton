import CommunityColumn from "@/components/communityColumn";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, FormEvent } from "react";
import { Dancing_Script } from "next/font/google";
import { useAuth } from "@/context/authContext";
const dancingScript = Dancing_Script({ subsets: ["latin"] });

function Community() {
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [anonymously, setAnonymously] = useState(false);
   const { currentUser } = useAuth();

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
         className="flex flex-col items-center h-full min-h-screen text-lg "
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
                     Which song makes you believe that love is harmful, {`it's`}
                     better not to feel it, and even better to avoid falling in
                     love?
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
                     Describe your emotions when that song plays. Does it stir
                     up feelings of vulnerability or weakness associated with
                     love?
                  </p>
               </CommunityColumn>
               <CommunityColumn
                  scroll={scroll}
                  className="bg-gradient-to-br to-[#a78ef9] from-[#51eace] h-full"
               >
                  <p className="text-base font-medium text-white pt-8 h-[10rem] flex ">
                     Which song gives you the feeling that if your loved one
                     departs, they take your love along with them?
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
                     Share your feelings of emptiness when you listen to that
                     song, the one that brings back memories of your departed
                     loved one. What special things did they do to stir up such
                     intense love within you?
                  </p>
               </CommunityColumn>
               <CommunityColumn
                  scroll={scroll}
                  className="bg-gradient-to-tr from-[#a78ef9] to-[#c7f7db] h-full"
               >
                  <p className="text-base font-medium text-white pt-8 h-[10rem] flex ">
                     {"What's"} that special song that makes you feel as if a
                     good partner/lover/companion heals you, motivates you,
                     inspires you, and excites you?
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
                     Reflect on the warmth and strength you feel when you listen
                     to that song that reminds you of an inspiring love, a love
                     that emboldens you and pushes you forward. Does this love
                     fill you with a sense of vitality?
                  </p>
               </CommunityColumn>
            </div>
         </div>
         <div className="flex flex-col items-center max-w-3xl mb-8 ">
            <div className="bg-gradient-to-r py-6 from-[#754af1] to-[#51eace] my-12 p-2 rounded-3xl drop-shadow">
               <h2 className="mx-auto mb-4 text-2xl font-medium tracking-wider text-center">
                  What is this activity about?
               </h2>
               <div className="flex flex-col items-center sm:flex-row">
                  <span className="!aspect-square !min-w-[15rem] relative  max-w-[70vw] mx-auto mb-8">
                     <Image
                        src="/MujerYourCanvas1.png"
                        alt="Mujer Your Canvas"
                        fill
                     />
                  </span>
                  <div className="flex flex-col px-8">
                     <p>
                        By registering, {"you're"} not only gaining the chance
                        to share your feelings but also becoming part of a
                        collective art masterpiece.
                     </p>
                     <p>
                        This activity is designed to help you uncover the
                        cultural impact of music on your life and how it has
                        shaped your concept of love. What does your unique
                        perception of love look like?
                     </p>
                     <p>
                        Your participation is invaluable as it fuels the
                        creation of art and literature, all grounded in
                        authentic, real-life narratives. Thank you for
                        contributing to this meaningful cause.
                     </p>
                     {/* <p>¿What does your vision of love look like?</p>
                     <p>
                        Thanks to your participation I can make art and books,
                        based on real stories. ​ ​
                     </p> */}
                  </div>
               </div>
            </div>
            <form
               onSubmit={sendEmail}
               ref={scrollRef}
               className="flex flex-col max-w-xl px-14 rounded-3xl drop-shadow bg-gradient-to-r  from-[#754af1] to-[#51eace] py-10 text-sm"
            >
               <p className="font-semibold">
                  Feel free to write your story here. {"You're"} welcome to
                  share as many different stories, linked with different songs,
                  as you wish.
               </p>
               <p className="my-2 text-sm">
                  Including your name and the country where you live is entirely
                  optional. If you prefer, you can choose to share your
                  experiences anonymously.
               </p>
               <p className="mb-6 text-sm">
                  By choosing to share your story, you grant Daya permission to
                  use your submitted content for her artwork, social media,
                  future projects like books, video podcasts, and more.
               </p>
               <div className={`${currentUser ? "hidden" : ""} flex flex-col`}>
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
               </div>
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
               <label
                  className={`${
                     currentUser ? "hidden" : ""
                  } flex my-4 font-medium`}
               >
                  <input type="checkbox" required />
                  <span className="pl-2 text-sm">
                     <p className="inline mr-1">
                        I accept the terms and conditions
                     </p>
                     <Link
                        href="/legal/terms-of-service"
                        target="_blank"
                        className="underline"
                     >
                        See Terms of Use
                     </Link>
                  </span>
               </label>
               <p className="mb-6">
                  By sharing your history, you are giving Daya the permission to
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
               {`"The insights gathered from these artistic activities will serve to craft art aimed at enhancing life's appreciation, while also enabling me to continue developing practices rooted in the authentic experiences we collectively share in this space."`}
            </p>
            <div className="bg-gradient-to-r from-[#754af1] to-[#51eace] rounded-3xl drop-shadow  flex flex-col items-center w-full py-6 mb-4">
               <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <span className="flex relative mx-auto min-w-[20rem]  sm:min-w-[15rem] h-[23rem]">
                     <Image
                        src="/ESCUCHA_LA_MUSICA_DE_TU_LIENZO.png"
                        fill
                        alt=""
                        className="object-cover object-top"
                     />
                  </span>

                  <div className="flex flex-col max-w-[90vw]  px-2 sm:max-w-xs flex-1">
                     <div>
                        <p className="text-2xl font-semibold text-[#edff05]">
                           ESCUCHA LA MÚSICA DE
                        </p>
                        <p className="text-2xl font-semibold text-white">
                           TU LIENZO
                        </p>
                        <p className="leading-4">
                           Tu cultura musical, un molde invisible que ha
                           configurado tus emociones
                        </p>
                     </div>
                     <div className="mt-12">
                        <p
                           className={`${dancingScript.className} text-4xl font-bold text-[#5225d7] rotate-[-5deg] mb-2 `}
                        >
                           WORKSHOP
                        </p>
                        <p className="leading-4">
                           Explora a través del arte y canciones herramientas
                           mentales que te ayudan a remodelar y mejorar tu
                           bienestar emocional.
                        </p>
                     </div>
                  </div>
               </div>
               <p className={` max-w-[95vw] mt-10 mb-4 text-white font-bold`}>
                  Daya Muneton © Todos Los Derechos Reservados
               </p>
            </div>
            <div className="sm:max-w-xl max-w-[80vw] mt-4 mb-10 text-sm font-medium">
               <p className="font-bold">
                  We believe that the more we talk about what hurts us, the
                  quicker we can locate the source of our pain.
               </p>
               <p>
                  Expressing what you feel can help you understand how you ended
                  up in this unsettling place. Gaining insight from {`other's`}{" "}
                  struggles can serve as a roadmap to your own healing.
               </p>
               <p>
                  Remember, {`it's`} essential to pay attention to your feelings
                  and not be ashamed to express your troubles. After all, we are
                  humans learning to navigate life.
               </p>
               <p>
                  Can you envision your story potentially aiding someone{" "}
                  {`else's`}
                  journey towards healing?
               </p>
               <p>
                  {`Don't`} hold back - write and share your unique perspective
                  on love.
               </p>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Community;
