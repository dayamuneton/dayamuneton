import { useAuth } from "@/context/authContext";
import { createPdfsCheckout } from "@/handlers/orders/createPdfsCheckout";
import Link from "next/link";
import React, { useState } from "react";
import { Acordion, AcordionButton, AcordionContent } from "./ui/acordion";

function AcquireGuide({
   product,
   language,
}: {
   product: any;
   language: string;
}) {
   const { currentUser } = useAuth();
   const [name, setName] = useState(currentUser?.displayName || "");
   const [email, setEmail] = useState(currentUser?.email || "");

   const redirectToCheckout = async (e: any) => {
      e.preventDefault();
      const response = await createPdfsCheckout({
         cartItems: [product],
         cancel_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}/ageofemotions/${
            product.category
         }/${encodeURIComponent(product.handle)}`,
         email,
         name,
         success_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}/ageofemotions/`,
         language,
      });

      if (response.url) {
         window.open(response.url, "_blank");
      }
   };
   // console.log(language);

   if (currentUser) {
      return (
         <button
            onClick={redirectToCheckout}
            className="my-2 text-lg bg-[#4a23a9] text-white border-2 border-[#4a23a9] rounded-md hover:scale-[1.005] px-4 py-2"
         >
            Buy this guide
         </button>
      );
   }
   return (
      <Acordion className="my-2 text-lg bg-[#4a23a9] text-white border-2 border-[#4a23a9] rounded-md hover:scale-[1.005]">
         <AcordionButton className="w-full px-4 py-2 ">
            Buy this guide
         </AcordionButton>
         <AcordionContent>
            <form
               onSubmit={redirectToCheckout}
               className="flex flex-col items-center w-full px-4 overflow-hidden transition-all duration-300 ease-in-out"
            >
               <label className="flex flex-col w-full mt-2">
                  <p>Name:</p>
                  <input
                     type="text"
                     required
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="flex w-full px-2 py-1 text-gray-800 bg-gray-100 outline-none"
                  />
               </label>
               <label className="flex flex-col w-full mt-2">
                  <p>Email:</p>
                  <input
                     type="email"
                     required
                     value={email}
                     // placeholder="Email"
                     onChange={(e) => setEmail(e.target.value)}
                     className="flex w-full px-2 py-1 text-gray-800 bg-gray-100 outline-none"
                  />
               </label>

               <label className="flex my-4 font-medium">
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
               <button className="w-[90%] my-4 px-4 py-2 text-white bg-[#4a23a9] border-2 border-white rounded-md">
                  Buy
               </button>
            </form>
         </AcordionContent>
      </Acordion>
   );
}

export default AcquireGuide;
