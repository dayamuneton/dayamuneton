import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiShoppingBag } from "react-icons/fi";
import PageIntro from "@/components/layout/PageIntro";
import PageSkeleton from "@/components/ui/PageSkeleton";
import CartItems from "@/components/checkout/cartItems";
import { useShop } from "@/context/shopContext";
import { useAuth } from "@/context/authContext";
import { formatCurrency } from "@/utils/formatCurrency";

const signInPath = "/auth/login?src=%2Fcheckout";

export default function Checkout() {
   const { shoppingCart, cartStatus, retryCart, refreshCart } = useShop();
   const { currentUser, authReady } = useAuth();
   const router = useRouter();
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");
   const itemCount = shoppingCart?.cartItems.length ?? 0;

   useEffect(() => {
      if (authReady && !currentUser) void router.replace(signInPath);
   }, [authReady, currentUser, router]);

   async function startCheckout() {
      if (!currentUser?.email || !shoppingCart || !itemCount || pending) return;
      setPending(true);
      setError("");
      try {
         const { createPdfsCheckout } = await import("@/handlers/orders/createPdfsCheckout");
         const response = await createPdfsCheckout({
            cartItems: shoppingCart.cartItems,
            cancel_url: "/checkout",
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email.split("@")[0],
            success_url: "/thankyou",
            cartId: shoppingCart.id,
         });
         if (!response.url) throw new Error("Missing checkout URL");
         refreshCart();
         await router.push(response.url);
      } catch {
         setError("Couldn’t open checkout. Please try again.");
      } finally {
         setPending(false);
      }
   }

   return (
      <div className="portfolio-content page-content">
         <Head><title>Cart | Daya Muneton</title><meta name="robots" content="noindex" /></Head>
         <PageIntro title="Your cart" />
         {!authReady || cartStatus === "loading" ? <PageSkeleton kind="form" label="Loading your cart…" /> :
            !currentUser ? <Link href={signInPath} className="portfolio-button portfolio-button-primary">Sign in</Link> :
            cartStatus === "error" ? <div className="content-panel empty-panel">
               <h2>We couldn’t load your cart</h2>
               <button type="button" onClick={retryCart} className="portfolio-button portfolio-button-primary">Try again</button>
            </div> :
            itemCount === 0 ? <div className="content-panel empty-panel">
               <FiShoppingBag aria-hidden="true" size={36} />
               <h2>Your cart is empty.</h2>
               <div className="portfolio-actions">
                  <Link href="/shop" className="portfolio-button portfolio-button-primary">Browse artwork</Link>
                  <Link href="/ageofemotions" className="portfolio-button portfolio-button-secondary">Browse guides</Link>
               </div>
            </div> :
            <div className="checkout-grid">
               <CartItems />
               <section className="content-panel detail-actions order-summary" aria-labelledby="order-summary">
                  <h2 id="order-summary">Order summary</h2>
                  <p className="checkout-total"><span>Total</span><strong>{formatCurrency(shoppingCart?.subTotal ?? 0)} USD</strong></p>
                  <button type="button" disabled={pending} onClick={startCheckout} className="portfolio-button portfolio-button-primary">
                     {pending ? "Opening checkout…" : "Checkout"}
                  </button>
                  {error && <p role="alert" className="form-feedback">{error}</p>}
               </section>
            </div>}
      </div>
   );
}
