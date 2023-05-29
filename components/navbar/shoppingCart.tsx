import { useAuth } from "@/context/authContext";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React, { useState, useEffect } from "react";
import { useShop } from "@/context/shopContext";

export function ShoppingCart({
   className,
   size,
}: {
   className?: string;
   size?: string;
}) {
   const { currentUser } = useAuth();
   const { shoppingCart } = useShop();
   const [cartQty, setCartQty] = useState<null | string>(null);

   const handleCartQty = (variantsLength?: number) => {
      if (!variantsLength || variantsLength === 0) return null;

      if (variantsLength > 9) return "9+";

      return variantsLength.toString();
   };

   useEffect(() => {
      if (!currentUser || !shoppingCart) return;

      let variantsLength = shoppingCart.cartItems?.length;

      setCartQty(handleCartQty(variantsLength));
   }, [shoppingCart, currentUser]);

   return (
      <div className={`${!currentUser ? "hidden" : ""}  ${className}`}>
         <div className="flex !aspect-square relative">
            <Link
               href="/checkout"
               className="flex items-center justify-center !min-h-full  cursor-pointer !aspect-square  "
            >
               <ShoppingCartIcon
                  className="flex text-gray-700"
                  sx={{
                     fontSize: size,
                  }}
               />
            </Link>
            {currentUser && cartQty && (
               <p className="absolute -bottom-2 -left-3 flex items-center justify-center p-1 text-[.6rem] text-white bg-red-600 rounded-full !aspect-square !w-5  !h-5">
                  {cartQty}
               </p>
            )}
         </div>
      </div>
   );
}
