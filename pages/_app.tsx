import { AuthProvider } from "@/context/authContext";
import { ShopProvider } from "@/context/shopContext";
import "@/styles/globals.css";
import type { AppProps, NextWebVitalsMetric } from "next/app";

export function reportWebVitals({ name, value, label }: NextWebVitalsMetric) {
   if (process.env.NEXT_PUBLIC_REPORT_VITALS === "1") {
      console.info("[Web Vitals]", { name, value, label });
   }
}

export default function App({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <ShopProvider>
            <Component {...pageProps} />
         </ShopProvider>
      </AuthProvider>
   );
}
