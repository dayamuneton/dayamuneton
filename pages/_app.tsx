import { AuthProvider } from "@/context/authContext";
import { ShopProvider } from "@/context/shopContext";
import RouteFeedback from "@/components/ui/RouteFeedback";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import { isPreviewSite } from "@/config/site-environment";
import StatusPage from "@/components/layout/StatusPage";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps, NextWebVitalsMetric } from "next/app";

export function reportWebVitals({ name, value, label }: NextWebVitalsMetric) {
   if (process.env.NEXT_PUBLIC_REPORT_VITALS === "1") {
      console.info("[Web Vitals]", { name, value, label });
   }
}

export default function App({ Component, pageProps }: AppProps) {
   const { pathname } = useRouter();
   const accountRoute = pathname === "/checkout" || /^\/(auth|admin)(\/|$)/.test(pathname);
   return (
      <AuthProvider>
         <ShopProvider>
            <div className="site-shell">
               <a className="skip-link" href="#main-content">Skip to content</a>
               <Navbar />
               <RouteFeedback>
                  {isPreviewSite && accountRoute
                     ? <StatusPage title="Portfolio preview" description="This preview uses sample listings and simulated checkout. Account and admin features are available in the local test build." />
                     : <Component key={pageProps.routeKey} {...pageProps} />}
               </RouteFeedback>
               <Footer />
            </div>
         </ShopProvider>
      </AuthProvider>
   );
}
