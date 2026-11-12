import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/shopContext";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { formatCurrency } from "@/utils/formatCurrency";

export default function CartItems() {
   const { shoppingCart, refreshCart } = useShop();
   const [pending, setPending] = useState<string>();
   const [error, setError] = useState("");

   async function remove(item: { handle: string; name: string; variantId?: string }) {
      setPending(item.name);
      setError("");
      try {
         const { removeCartItem } = await import("@/integrations/firebase/shoppingCart/removeItemFromShoppingCart");
         await removeCartItem(shoppingCart, item);
         refreshCart();
      } catch {
         setError("Couldn’t remove " + item.name + ". Please try again.");
      } finally {
         setPending(undefined);
      }
   }

   return (
      <section aria-label="Cart items">
         {error && <p role="alert" className="form-feedback mb-3">{error}</p>}
         <ul className="cart-items">
            {shoppingCart?.cartItems.map((item) => {
               const catalog = item.variants ? "/ageofemotions" : "/shop";
               const href = /^\/(ageofemotions|shop)\/[^/]/.test(item.handle)
                  ? item.handle
                  : catalog + "/" + encodeURIComponent(item.category) + "/" + encodeURIComponent(item.handle);
               return (
                  <li key={item.handle + ":" + item.name} className="content-panel cart-row">
                     <div className="cart-thumb">
                        <ArtworkImage src={item.featuredImage || item.images?.[0]} alt="" fill sizes="80px" className="object-cover" />
                     </div>
                     <div>
                        <Link href={href} className="font-semibold">{item.name}</Link>
                        <p className="text-muted">{formatCurrency(item.price)}</p>
                        <button type="button" className="form-link min-h-11" onClick={() => void remove(item)}
                           aria-label={"Remove " + item.name} disabled={!!pending}>
                           {pending === item.name ? "Removing…" : "Remove"}
                        </button>
                     </div>
                  </li>
               );
            })}
         </ul>
      </section>
   );
}
