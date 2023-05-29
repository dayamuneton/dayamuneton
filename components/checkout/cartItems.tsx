import { useShop } from "@/context/shopContext";
import { removeCartItem } from "@/integrations/firebase/shoppingCart/removeItemFromShoppingCart";
import Image from "next/image";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

function limitText(text: string, limit: number) {
   if (text.length > limit) {
      return text.substring(0, limit) + "...";
   } else {
      return text;
   }
}

function CartItems({ className }: { className?: string }) {
   const { shoppingCart } = useShop();
   // const mailerlite_groups = shoppingCart?.cartItems?.map(
   // (item) => item.mailerlite_group
   // );
   // console.log(mailerlite_groups);

   // console.log(shoppingCart);

   return (
      <div className={`${className} text-gray-100 `}>
         {shoppingCart?.cartItems?.map((item) => (
            <div
               key={item.handle}
               className="w-full flex flex-col p-4 mb-2 bg-gradient-to-l to-[#5cdde5] from-[#4a23a9] drop-shadow-md rounded-lg hover:scale-[1.005] "
            >
               <Link
                  href={item.handle}
                  className="flex flex-col items-center w-full sm:items-start sm:flex-row"
               >
                  <span className="relative flex min-w-[7rem] w-[7rem] aspect-square sm:mr-3">
                     <Image
                        src={item.featuredImage || item.images[0]}
                        fill
                        alt={item.name}
                        className="object-cover"
                     />
                  </span>
                  <span className="flex flex-col w-full ">
                     <p className="w-full mt-1 font-medium">{item.name}</p>
                     <p className="text-sm">
                        {limitText(item.description, 100)}{" "}
                     </p>
                  </span>
               </Link>
               <div className="flex mt-auto ml-auto">
                  <div className="flex items-end font-medium">
                     <p className="">
                        {item.price.toLocaleString("en-US", {
                           style: "currency",
                           currency: "USD",
                        })}
                     </p>
                     <p className="ml-1">USD</p>
                  </div>
                  <button
                     className="mx-2 text-gray-200 hover:text-red-600"
                     onClick={() => removeCartItem(shoppingCart, item)}
                  >
                     <DeleteIcon />
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}

export default CartItems;
