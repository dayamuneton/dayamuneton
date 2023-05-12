import { useAuth } from "@/context/authContext";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Login() {
   const { loginWithGoogle, currentUser } = useAuth();
   const router = useRouter();
   useEffect(() => {
      if (currentUser) {
         router.push("/admin");
      }
   }, [currentUser, router]);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <Head>
            <title>Login | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="relative w-[90%] max-w-sm   mx-auto">
            <button
               type="button"
               onClick={loginWithGoogle}
               className="flex items-center justify-center w-full p-2 border-2 rounded hover:scale-[1.005] mt-1"
            >
               <Image
                  src="/icons/google.png"
                  alt="Google icon"
                  fill
                  className="!relative mr-4 flex !h-6 !w-6  !aspect-square"
               />
               <p>Continua con Google</p>
            </button>
         </div>
      </div>
   );
}

export default Login;
