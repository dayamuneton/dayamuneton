import Head from "next/head";
import React, { useEffect } from "react";
import CartItems from "@/components/checkout/cartItems";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ShoppingCart } from "@/components/navbar/shoppingCart";
import { useShop } from "@/context/shopContext";
import { createPdfsCheckout } from "@/handlers/orders/createPdfsCheckout";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
// import FooterBottom from "@/components/footer/footerBottom";
// import ShopNowButton from "@/components/checkout/shopNowButton";

function Checkout() {
   const { shoppingCart } = useShop();
   const { currentUser } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!currentUser) {
         router.push("/auth/login");
      }
   }, [currentUser, router]);

   const redirectToCheckout = async (e: any) => {
      e.preventDefault();
      const response = await createPdfsCheckout({
         cartItems: shoppingCart?.cartItems || [],
         cancel_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}/checkout`,
         email: currentUser.email,
         name: currentUser.displayName,
         success_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}`,
         cartId: shoppingCart?.id,
      });

      if (response.url) {
         router.push(response.url);
      }
   };

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

         <div className="flex-1 max-w-md sm:max-w-xl">
            <div className=" p-8 bg-gradient-to-r from-[#4a23a9] to-[#5cdde5] rounded-xl  drop-shadow-xl my-12 ">
               <p className="mb-2 text-xl font-medium text-white">My Cart</p>

               <CartItems className="flex flex-col w-full " />

               <span
                  className={`${
                     shoppingCart?.cartItems?.length == 0 ? "hidden" : ""
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
                        shoppingCart?.cartItems?.length == 0 ? "" : "!hidden"
                     } text-[#1b005f]`}
                  />
                  <div className="w-full drop-shadow">
                     <button
                        onClick={redirectToCheckout}
                        className=" w-full max-w-xl px-8 py-3 mt-2  mr-2 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow hover:scale-[1.03]"
                        hidden={shoppingCart?.cartItems?.length == 0}
                     >
                        Checkout
                     </button>
                     <span className="flex">
                        <Link
                           href="/shop"
                           className="w-full  px-8 py-3 mt-2 mb-8 mr-2 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow hover:scale-[1.03]"
                        >
                           Paintings
                        </Link>
                        <Link
                           href="/ageofemotions"
                           className="w-full  px-8 py-3 mt-2 mb-8 text-2xl font-bold text-center text-white bg-[#4a23a9] rounded-lg drop-shadow hover:scale-[1.03]"
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
