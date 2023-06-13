import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
   subsets: ["latin"],
});

function Thankyou() {
   return (
      <div
         className="flex flex-col items-center w-full h-full min-h-screen text-gray-300"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Thank You | Daya Muneton</title>
            <meta name="description" content="Términos de uso Ama Y Liberate" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col items-center pt-12 w-[95vw] max-w-md mb-8">
            <h1 className="text-2xl font-bold text-center text-black">
               <p>Welcome to Your Journey </p>
               <p>with Art & Emotions</p>
               <p>THANK YOU!</p>
            </h1>
            <div className="flex flex-col gap-4 my-4 text-base leading-4">
               <p>
                  Thank you for choosing to embark on this transformative
                  journey of enhancing your {"body's"} perception of emotions
                  through art, creative exploration, and mindful reflection.​
               </p>
               <p>
                  Your support helps advance our shared mission of promoting
                  emotional wellbeing. By purchasing our downloadable guide,{" "}
                  {"you've"} taken a step towards self-discovery and
                  empowerment.
               </p>
               <p>
                  Please kindly check your email for the guide. {"It's"} time to
                  dive in and start exploring the profound connection between
                  emotions and art. Remember, each step you take in this journey
                  is a stride towards understanding and celebrating your unique
                  emotional spectrum.
               </p>
               <span className="flex flex-col gap-2">
                  <p>
                     If you have any questions or require assistance along the
                     way, please {"don't"} hesitate to get in touch.
                  </p>
                  <p>{"I'm"} here to support you on this exciting path.</p>
                  <span>
                     feel free to email me directly at
                     <Link
                        href="mailto:info@dayamuneton.com"
                        className="mx-1 underline"
                     >
                        info@dayamuneton.com.
                     </Link>
                  </span>
                  <p>Thank you once again for being a part of this journey.</p>
                  <p>Best regards,</p>
               </span>
               <p className={`${dancingScript.className} text-4xl`}>
                  Daya Muneton
               </p>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Thankyou;
