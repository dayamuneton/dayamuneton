import { AuthProvider } from "@/context/authContext";
import { ShopProvider } from "@/context/shopContext";
import RouteFeedback from "@/components/ui/RouteFeedback";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
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
            <div className="site-shell">
               <a className="skip-link" href="#main-content">Skip to content</a>
               <Navbar />
               <RouteFeedback>
                  <Component key={pageProps.routeKey} {...pageProps} />
               </RouteFeedback>
               <Footer />
            </div>
         </ShopProvider>
      </AuthProvider>
   );
}
