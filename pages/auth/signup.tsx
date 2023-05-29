import ContinueWith from "@/components/continueWith";
import { useAuth } from "@/context/authContext";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, FormEvent } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";

function extractFirebaseError(error: string) {
   const regex = /Error \(([^)]+)\)/;
   const match = error.match(regex);
   return match ? match[0] : null;
}

function SignUp() {
   const router = useRouter();
   // const [showLogin, setShowLogin] = useState(true);
   const { currentUser, signUpUserWithEmailAndPassword } = useAuth();
   const [inputName, setInputName] = useState("");
   const [email, setEmail] = useState("");
   const [error, setError] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   useEffect(() => {
      if (currentUser) {
         let src = router.query.src;
         if (typeof src !== "string") {
            src = undefined;
         }
         router.replace(src || "/");
      }
   }, [router, currentUser]);

   const signUpUser = async (e: FormEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
         setError("Las contraseñas no coinciden");
         return;
      }

      let signInError = await signUpUserWithEmailAndPassword(
         email,
         password,
         inputName
      );

      if (signInError) {
         signInError = extractFirebaseError(signInError);

         setError(signInError);
         console.log(signInError);
         return;
      } else {
         setError("");
      }

      setInputName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
   };

   return (
      <div
         className="flex flex-col items-center h-full min-h-screen text-gray-100 bg-lightGray"
         style={{
            backgroundImage:
               "radial-gradient(circle at center, #4a23a9, #5cdde5)",
         }}
      >
         <Head>
            <title>Sign Up | Daya Muneton</title>
            <meta name="description" content="Generated by create next app" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="max-w-[90vw] w-[20rem] my-10">
            <div className="flex flex-col items-center w-full ">
               <div
                  className={`${
                     error === "" ? "hidden" : "flex"
                  } w-full bg-[#ffc0c0]  justify-center`}
               >
                  <span className="p-1 text-sm text-center text-black">
                     <p>{error} </p>
                     <p
                        className={
                           error === "Error (auth/email-already-in-use)"
                              ? ""
                              : "hidden"
                        }
                     >
                        Try sign up with google
                     </p>
                  </span>
               </div>
               <h1 className="mt-2 mb-4 text-3xl font-bold">Sign Up</h1>

               <form
                  onSubmit={signUpUser}
                  className="flex flex-col items-center w-full"
               >
                  <div className="authInputBox bg-gradient-to-r to-[#5cdde5] from-[#4a23a9]">
                     <input
                        type="text"
                        name="name"
                        required
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                     />
                     <label htmlFor="name">Full Name:</label>
                  </div>
                  <div className="authInputBox bg-gradient-to-r to-[#5cdde5] from-[#4a23a9]">
                     <input
                        type="text"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                     <label htmlFor="email">Email:</label>
                  </div>
                  <div className="authInputBox bg-gradient-to-r to-[#5cdde5] from-[#4a23a9]">
                     <input
                        type={`${showPassword ? "text" : "password"}`}
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <VisibilityIcon
                        onClick={() => setShowPassword((show) => !show)}
                        className="text-[#555] hover:text-[#333] cursor-pointer"
                     />

                     <label htmlFor="password">Password:</label>
                  </div>
                  <div className="authInputBox bg-gradient-to-r to-[#5cdde5] from-[#4a23a9]">
                     <input
                        type={`${showConfirmPassword ? "text" : "password"}`}
                        name="confirm password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                     />
                     <VisibilityIcon
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        className="text-[#555] hover:text-[#333] cursor-pointer"
                     />

                     <label htmlFor="confirm password">Confirm Password:</label>
                  </div>

                  <div className="flex flex-col items-center w-full mx-auto ">
                     <button
                        type="submit"
                        className="w-full p-2 mt-2 text-white bg-gradient-to-l to-[#5cdde5] from-[#4a23a9]  rounded hover:scale-[1.005]"
                     >
                        Continue
                     </button>
                  </div>
               </form>
            </div>

            <div className="flex gap-1 py-4 text-sm">
               <p>Already Have An Account?</p>
               <Link
                  href={`/auth/login${
                     router.query.src ? `?src=${router.query.src}` : ""
                  }`}
                  className="text-blue-400 underline"
               >
                  Login
               </Link>
            </div>
            <ContinueWith className="pt-4 mt-2" />
         </div>
      </div>
   );
}

export default SignUp;
