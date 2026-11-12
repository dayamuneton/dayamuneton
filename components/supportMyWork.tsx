import React, { useState } from "react";
import { useRouter } from "next/router";
import { dollarsToCents } from "@/integrations/stripe/line-items";
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
         className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-hidden"
      >
         ${amount}
      </button>
   );
}
const tipOptions = [3, 5, 10, 20, 50];

const SupportMyWork: React.FC = () => {
   const router = useRouter();
   const [amount, setAmount] = useState(5);
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");

   const redirectToCheckout = async () => {
      if (pending) return;
      if (dollarsToCents(amount) === null) {
         setError("Enter an amount of at least $0.50 in dollars and cents.");
         return;
      }
      setPending(true);
      setError("");
      try {
         const response = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               lineItems: [{
                  price: amount,
                  images: ["https://www.dayamuneton.com/DayaMunetonB&WArt.jpg"],
                  name: "Support My Work",
               }],
            }),
         });
         const data = await response.json();
         if (!response.ok || typeof data.url !== "string") throw new Error("Checkout unavailable");
         await router.push(data.url);
      } catch {
         setError("Checkout is unavailable. Please try again.");
      } finally {
         setPending(false);
      }
   };

   return (
      <Acordion className="flex flex-col items-center justify-center rounded-xl bg-linear-to-r/srgb from-[#4a23a9] to-[#5cdde5] drop-shadow-md w-[90vw] max-w-xl">
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
                  aria-label="Tip amount in US dollars"
                  min={0.5}
                  step={0.01}
                  placeholder="Or enter another amount"
                  className="w-full pl-2 bg-transparent outline-hidden"
               />
            </div>
            <button
               type="button"
               disabled={pending}
               onClick={redirectToCheckout}
               className="bg-[#5cdde5] mx-auto mt-4 w-full py-2 text-white rounded-full drop-shadow-md hover:scale-[1.01] "
            >
               {pending ? "Opening checkout…" : "Send"}
            </button>
            {error && <p role="alert" className="mt-2">{error}</p>}
         </AcordionContent>
      </Acordion>
   );
};

export default SupportMyWork;
