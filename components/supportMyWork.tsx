import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";

const SupportMyWork: React.FC = () => {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const [amount, setAmount] = useState<number>();
   const toggleAccordion = () => {
      setIsOpen(!isOpen);
   };

   const redirectToCheckout = async () => {
      if (amount && amount < 0.5) return;
      const response = await fetch(`/api/create-checkout-session`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
         body: JSON.stringify({
            amount: amount,
         }),
      });
      const data = await response.json();
      if (data.url) {
         router.push(data.url);
      }
      // console.log(data);
   };

   return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#4a23a9] to-[#5cdde5] drop-shadow-md w-[90vw] max-w-xl">
         <button
            className="w-full scale-[1.01] px-4 py-2 text-white  rounded-lg "
            onClick={toggleAccordion}
         >
            Click here to support my work
         </button>
         <div
            className={`overflow-hidden w-full flex flex-col items-center transition-all duration-300 ease-in-out ${
               isOpen ? "max-h-[100vh]" : "max-h-[0vh]"
            }`}
         >
            <div className="flex flex-col flex-wrap w-full max-w-lg px-6 pb-4 ">
               <h3 className="mb-4">Tip (in USD)</h3>
               <div className="flex flex-wrap w-full gap-2 mx-auto sm:justify-between sm:flex-nowrap ">
                  <button
                     onClick={() => setAmount(3)}
                     className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
                  >
                     $3
                  </button>
                  <button
                     onClick={() => setAmount(5)}
                     className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
                  >
                     $5
                  </button>
                  <button
                     onClick={() => setAmount(10)}
                     className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
                  >
                     $10
                  </button>
                  <button
                     onClick={() => setAmount(20)}
                     className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
                  >
                     $20
                  </button>
                  <button
                     onClick={() => setAmount(50)}
                     className="hover:scale-[1.01] px-4 py-2 text-white border-2 w-[30%] sm:w-full text-center border-white rounded-full focus:outline-none"
                  >
                     $50
                  </button>
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
            </div>
         </div>
      </div>
   );
};

export default SupportMyWork;
