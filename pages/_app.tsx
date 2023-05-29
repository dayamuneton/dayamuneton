import { AuthProvider } from "@/context/authContext";
import { ShopProvider } from "@/context/shopContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <ShopProvider>
            <Component {...pageProps} />
         </ShopProvider>
      </AuthProvider>
   );
}
