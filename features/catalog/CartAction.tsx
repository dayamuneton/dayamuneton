import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import { useShop } from "@/context/shopContext";
import type { GuiaProductVariant } from "@/models/guiaProductModel";

interface CartProduct {
   handle: string;
   name: string;
   price: number;
   id: string;
}

export default function CartAction({ product, variant }: { product: CartProduct; variant?: GuiaProductVariant }) {
   const { asPath } = useRouter();
   const { currentUser, authReady } = useAuth();
   const { shoppingCart, cartStatus, refreshCart } = useShop();
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");
   const email = currentUser?.email;
   const item = shoppingCart?.cartItems.find((entry) =>
      (entry.handle === product.handle || entry.handle === asPath)
      && (!variant || entry.variantId === variant.id));

   async function updateCart() {
      if (!email || pending) return;
      setPending(true);
      setError("");
      try {
         if (item) {
            const { removeCartItem } = await import("@/integrations/firebase/shoppingCart/removeItemFromShoppingCart");
            await removeCartItem(shoppingCart, item);
         } else {
            const { addItemToCart } = await import("@/integrations/firebase/shoppingCart/addItemToShoppingCart");
            await addItemToCart(shoppingCart, product, email, variant);
         }
         refreshCart();
      } catch {
         setError("Couldn’t update your cart. Please try again.");
      } finally {
         setPending(false);
      }
   }

   if (!authReady) return <span className="cart-action-placeholder" aria-hidden="true" />;
   if (!email) return (
      <Link href={{ pathname: "/auth/login", query: { src: asPath } }}
         className="portfolio-button portfolio-button-secondary">Sign in to use your cart</Link>
   );
   if (cartStatus === "error") return <Link href="/checkout" className="form-link">Open your cart to retry</Link>;
   return (
      <div className="detail-actions">
         <button type="button" className="portfolio-button portfolio-button-secondary"
            disabled={pending || cartStatus === "loading"} onClick={updateCart}>
            {pending ? "Updating cart…" : cartStatus === "loading" ? "Loading cart…" : item ? "Remove from cart" : "Add to cart"}
         </button>
         {error && <p className="form-feedback" role="alert">{error}</p>}
      </div>
   );
}
