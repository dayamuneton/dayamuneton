import Head from "next/head";
import { useEffect, useState } from "react";
import CartItems from "@/components/checkout/cartItems";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useShop } from "@/context/shopContext";
import { createPdfsCheckout } from "@/handlers/orders/createPdfsCheckout";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
// import FooterBottom from "@/components/footer/footerBottom";
// import ShopNowButton from "@/components/checkout/shopNowButton";

function Checkout() {
   const { shoppingCart } = useShop();
   const { currentUser, authReady } = useAuth();
   const router = useRouter();
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");
   const itemCount = shoppingCart?.cartItems?.length ?? 0;

   useEffect(() => {
      if (authReady && !currentUser) {
         router.push("/auth/login");
      }
   }, [authReady, currentUser, router]);

   const redirectToCheckout = async () => {
      if (!currentUser?.email || !shoppingCart || !itemCount || pending) return;
      setPending(true);
      setError("");
      try {
         const response = await createPdfsCheckout({
            cartItems: shoppingCart.cartItems,
            cancel_url: "/checkout",
            email: currentUser.email,
            name: currentUser.displayName || "",
            success_url: "/",
            cartId: shoppingCart.id,
         });
         if (!response.url) throw new Error("Missing checkout URL");
         await router.push(response.url);
      } catch {
         setError("Couldn’t open checkout. Please try again.");
      } finally {
         setPending(false);
      }
   };

   if (!authReady || !currentUser) {
      return <><Navbar /><p role="status" className="mx-auto mt-12 text-center">
         {authReady ? "Taking you to sign in…" : "Loading your cart…"}
      </p></>;
   }

   return (
      <div
         className="flex flex-col items-center w-full h-full min-h-screen"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Checkout</title>
            <meta name="description" content="Términos de uso Ama Y Liberate" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />

         <div className="flex-1 w-full max-w-xl px-4">
            <div className=" p-8 bg-linear-to-r/srgb from-[#4a23a9] to-[#5cdde5] rounded-xl  drop-shadow-xl my-12 ">
               <p className="mb-2 text-xl font-medium text-white">My Cart</p>

               <CartItems className="flex flex-col w-full " />

               <span
                  className={`${
                     itemCount === 0 ? "hidden" : ""
                  } flex justify-between mt-8 text-2xl font-medium text-gray-200`}
               >
                  <p>Total: </p>
                  <p>
                     {shoppingCart?.subTotal?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                     })}{" "}
                     USD
                  </p>
               </span>

               <div className={` flex flex-col items-center`}>
                  <ShoppingCartIcon
                     sx={{ fontSize: "4rem" }}
                     className={`${
                        itemCount === 0 ? "" : "!hidden"
                     } text-[#1b005f]`}
                  />
                  <div className="w-full drop-shadow-sm">
                     {itemCount === 0 && <p className="text-center text-white">Your cart is empty.</p>}
                     <button type="button" disabled={pending}
                        onClick={redirectToCheckout}
                        className=" w-full max-w-xl px-8 py-3 mt-2  mr-2 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow-sm hover:scale-[1.03]"
                        hidden={itemCount === 0}
                     >
                        {pending ? "Opening checkout…" : "Checkout"}
                     </button>
                     {error && <p role="alert" className="mt-2 rounded bg-white p-3 text-[#9b203e]">{error}</p>}
                     <span className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                        <Link
                           href="/shop"
                           className="w-full  px-8 py-3 mt-2 mb-8 mr-2 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow-sm hover:scale-[1.03]"
                        >
                           Paintings
                        </Link>
                        <Link
                           href="/ageofemotions"
                           className="w-full  px-8 py-3 mt-2 mb-8 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow-sm hover:scale-[1.03]"
                        >
                           Guides
                        </Link>
                     </span>
                  </div>
               </div>
               {/* <ShopNowButton /> */}
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Checkout;
