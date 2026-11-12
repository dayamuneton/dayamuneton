import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { MdShoppingCart } from "react-icons/md";
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
   const itemCount = shoppingCart?.cartItems.length ?? 0;
   const cartQty = itemCount > 9 ? "9+" : itemCount || null;

   return (
      <div className={`${!currentUser ? "hidden" : ""} ${className ?? ""}`}>
         <div className="flex !aspect-square relative">
            <Link
               href="/checkout"
               aria-label="Shopping cart"
               className="site-nav-icon"
            >
               <MdShoppingCart size={size} aria-hidden="true" />
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
