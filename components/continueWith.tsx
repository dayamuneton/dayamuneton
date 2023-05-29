import { useAuth } from "@/context/authContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function ContinueWith({ className }: { className?: string }) {
   const { loginWithGoogle } = useAuth();
   return (
      <div
         className={`${className} w-full relative border-t-2 border-t-gray-400 `}
      >
         <button
            type="button"
            onClick={loginWithGoogle}
            className="flex items-center justify-center w-full p-2  rounded hover:scale-[1.005] my-1 bg-white text-black"
         >
            <Image
               src="/icons/google.png"
               alt="Google icon"
               fill
               className="!relative mr-4 flex !h-6 !w-6  !aspect-square"
            />
            <p>Continue With Google</p>
         </button>
         <p className="text-center">
            By continuing, you agree to our
            <Link
               className="mx-1 underline"
               href="/terms-of-use"
               target="_blank"
            >
               Terms of Service
            </Link>
            and
            <Link
               className="mx-1 underline"
               href="/privacy-policy"
               target="_blank"
            >
               Privacy Policy.
            </Link>
         </p>
      </div>
   );
}

export default ContinueWith;
