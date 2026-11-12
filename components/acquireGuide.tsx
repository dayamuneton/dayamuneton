import { useAuth } from "@/context/authContext";
import { createPdfsCheckout } from "@/handlers/orders/createPdfsCheckout";
import { GuiaProduct, GuiaProductVariant } from "@/models/guiaProductModel";
import { removeUndefinedEntriesFromObject } from "@/utils/removeUndefinedEntriesFromObject";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FormEvent, type MouseEvent } from "react";
import { Acordion, AcordionButton, AcordionContent } from "./ui/acordion";

function AcquireGuide({
   product,
   variant,
}: {
   product: GuiaProduct;
   variant?: GuiaProductVariant;
}) {
   const router = useRouter();
   const { currentUser } = useAuth();
   const [name, setName] = useState(currentUser?.displayName || "");
   const [email, setEmail] = useState(currentUser?.email || "");
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");

   const redirectToCheckout = async (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (pending) return;
      setPending(true);
      setError("");
      const data = removeUndefinedEntriesFromObject(product);
      if (variant) {
         data.name = `${product.name} (${variant.title})`;
         data.mailerlite_group = variant.mailerlite_group;
         data.variantId = variant.id;
      }

      try {
         const response = await createPdfsCheckout({
            cartItems: [data],
            cancel_url: `/ageofemotions/${product.category}/${encodeURIComponent(product.handle || "")}`,
            email: currentUser?.email || email,
            name: currentUser?.displayName || name,
            success_url: "/thankyou",
         });
         if (!response.url) throw new Error("Missing checkout URL");
         await router.push(response.url);
      } catch {
         setError("Couldn’t open checkout. Please try again.");
      } finally {
         setPending(false);
      }
   };
   let buttonText = "Buy this guide";
   if (product.price === 0) {
      buttonText = "Acquire Guide";
   }

   if (currentUser) {
      return (
         <div className="w-full">
            <button type="button" disabled={pending}
               onClick={redirectToCheckout}
               className="my-2 text-lg bg-[#4a23a9] text-white border-2 border-[#4a23a9] rounded-md px-4 py-2"
            >
               {pending ? "Opening checkout…" : buttonText}
            </button>
            {error && <p role="alert" className="text-sm text-[#9b203e]">{error}</p>}
         </div>
      );
   }
   return (
      <Acordion className="my-2 text-lg bg-[#4a23a9] text-white border-2 border-[#4a23a9] rounded-md hover:scale-[1.005]">
         <AcordionButton className="w-full px-4 py-2 ">
            {buttonText}
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
                     className="flex w-full px-2 py-1 text-gray-800 bg-gray-100 outline-hidden"
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
                     className="flex w-full px-2 py-1 text-gray-800 bg-gray-100 outline-hidden"
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
               <button type="submit" disabled={pending}
                  className="w-[90%] my-4 min-h-11 px-4 py-2 text-white bg-[#4a23a9] border-2 border-white rounded-md">
                  {pending ? "Opening checkout…" : buttonText}
               </button>
               {error && <p role="alert" className="mb-4 text-sm">{error}</p>}
            </form>
         </AcordionContent>
      </Acordion>
   );
}

export default AcquireGuide;
