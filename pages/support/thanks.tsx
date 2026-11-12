import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import { isLocalSite } from "@/config/site-environment";

export default function SupportThanks() {
   return (
      <div className="portfolio-home">
         <Head>
            <title>Thank You for Your Support | Daya Muneton</title>
            <meta name="robots" content="noindex" />
         </Head>
         <Navbar />
         <main className="portfolio-content">
            <div className="portfolio-intro">
               <h1>Thank you for your support</h1>
               <p className="portfolio-intro-copy">
                  Your support helps make art and emotional education more accessible.
               </p>
               {isLocalSite && <p className="mt-3 text-sm">This was a test checkout. No payment was made.</p>}
               <div className="portfolio-actions">
                  <Link href="/" className="portfolio-button portfolio-button-primary">Back to the portfolio</Link>
               </div>
            </div>
         </main>
      </div>
   );
}
