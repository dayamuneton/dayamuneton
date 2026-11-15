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

   if (!currentUser) return null;
   return (
      <Link href="/checkout" aria-label="Shopping cart"
         className={`site-nav-icon ${className ?? ""}`}>
         <MdShoppingCart size={size} aria-hidden="true" />
         {cartQty && <span aria-hidden="true" className="cart-count">{cartQty}</span>}
      </Link>
   );
}
