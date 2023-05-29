import React, { useState } from "react";
import { useRouter } from "next/router";
import {
   Acordion,
   AcordionButton,
   AcordionContent,
   AcordionIcon,
} from "./ui/acordion";

function TipOption({
   setAmount,
   amount,
}: {
   setAmount: React.Dispatch<React.SetStateAction<number>>;
   amount: number;
}) {
   return (
      <button
         onClick={() => setAmount(amount)}
         className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
      >
         ${amount}
      </button>
   );
}
const tipOptions = [3, 5, 10, 20, 50];

const SupportMyWork: React.FC = () => {
   const router = useRouter();
   const [amount, setAmount] = useState(5);

   const redirectToCheckout = async () => {
      if (amount && amount < 0.5) return;
      const response = await fetch(`/api/stripe/create-checkout-session`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
         body: JSON.stringify({
            lineItems: [
               {
                  price: amount,
                  images: ["https://www.dayamuneton.com/DayaMunetonB&WArt.jpg"],
                  name: "Support My Work",
               },
            ],
         }),
      });
      const data = await response.json();
      if (data.url) {
         router.push(data.url);
      }
   };

   return (
      <Acordion className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#4a23a9] to-[#5cdde5] drop-shadow-md w-[90vw] max-w-xl">
         <AcordionButton className="relative w-full scale-[1.01] px-4 py-2 text-white  rounded-lg flex">
            <p className="w-full text-center">Click here to support my work</p>
            <AcordionIcon className="absolute right-4" />
         </AcordionButton>
         <AcordionContent className="flex  flex-col  justify-center w-[90%] mx-auto px-6 pb-4 ">
            <h3 className="mb-4">Tip (in USD)</h3>
            <div className="flex flex-wrap w-full gap-2 mx-auto sm:justify-between sm:flex-nowrap ">
               {tipOptions.map((tip) => (
                  <TipOption key={tip} setAmount={setAmount} amount={tip} />
               ))}
            </div>
            <div className="flex w-full p-2 px-6 mt-4 bg-transparent border-2 border-white rounded-full">
               <p>$</p>
               <input
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="number"
                  placeholder="Or enter another amount"
                  className="w-full pl-2 bg-transparent outline-none"
               />
            </div>
            <button
               onClick={redirectToCheckout}
               className="bg-[#5cdde5] mx-auto mt-4 w-full py-2 text-white rounded-full drop-shadow-md hover:scale-[1.01] "
            >
               Send
            </button>
         </AcordionContent>
      </Acordion>
   );
};

export default SupportMyWork;
