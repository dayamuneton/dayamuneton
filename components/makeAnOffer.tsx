import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { Acordion, AcordionButton, AcordionContent } from "./ui/acordion";

function MakeAnOffer({ initialPrice }: { initialPrice: number }) {
   const [offer, setOffer] = useState<string | number>(initialPrice);
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState("");
   const [phoneNumber, setPhoneNumber] = useState<string | number>("");
   const { currentUser } = useAuth();

   const sendEmail = async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return;
      try {
         setLoading(true);
         setName("");
         setEmail("");
         setMessage("");
         setPhoneNumber("");
         await fetch("/api/send-email", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name,
               email,
               message: `Initial Price: ${initialPrice}, Offer:${offer}, Difference%:  ${
                  100 - Math.floor((Number(offer) / initialPrice) * 100)
               }%, Phone Number: ${phoneNumber}, Message:  ${message}`,
            }),
         });
         setLoading(false);
      } catch (error) {
         console.error(error);
      }
   };

   const handleNumberInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setState: React.Dispatch<React.SetStateAction<string | number>>
   ) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
         setState(value);
      }
   };

   return (
      <Acordion className="text-lg bg-[#4a23a9] text-white border-2 border-[#4a23a9] rounded-md hover:scale-[1.005]">
         <AcordionButton className="w-full px-4 py-2 ">
            Make an offer
         </AcordionButton>
         <AcordionContent>
            <form
               onSubmit={sendEmail}
               className="flex flex-col items-center w-full px-4 overflow-hidden transition-all duration-300 ease-in-out"
            >
               <label className="flex flex-col w-full mt-2">
                  <p>Offer:</p>
                  <span className="flex items-center pl-2 text-gray-800 bg-gray-100">
                     <p>$</p>
                     <input
                        type="text"
                        value={offer}
                        onChange={(e) => handleNumberInputChange(e, setOffer)}
                        className="flex w-full px-1 py-1 bg-transparent outline-none "
                     />
                     <p className="px-2 py-1 text-sm text-white bg-[#4a23a9] rounded-full">
                        {
                           -(
                              100 -
                              Math.floor((Number(offer) / initialPrice) * 100)
                           )
                        }
                        %
                     </p>
                  </span>
               </label>
               <div
                  className={`${
                     currentUser ? "hidden" : ""
                  } flex flex-col w-full `}
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
               </div>
               <label className="flex flex-col w-full mt-2">
                  <p>Phone Number:</p>
                  <span className="flex items-center pl-2 text-gray-800 bg-gray-100">
                     <p>+</p>
                     <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) =>
                           handleNumberInputChange(e, setPhoneNumber)
                        }
                        className="flex w-full px-2 py-1 text-gray-800 bg-transparent outline-none"
                     />
                  </span>
               </label>
               <label className="flex flex-col w-full mt-2">
                  <p>Message:</p>
                  <textarea
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     rows={4}
                     className="flex w-full px-2 py-1 text-gray-800 bg-gray-100 outline-none"
                  />
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
                        href="/terms-of-use"
                        target="_blank"
                        className="underline"
                     >
                        See Terms of Use
                     </Link>
                  </span>
               </label>
               <button className="w-[90%] my-4 px-4 py-2 text-white bg-[#4a23a9] border-2 border-white rounded-md">
                  Submit My Offer
               </button>
            </form>
         </AcordionContent>
      </Acordion>
   );
}

export default MakeAnOffer;
