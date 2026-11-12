import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import { isTestSite } from "@/config/site-environment";

export default function ThankYou() {
   return (
      <div className="portfolio-content page-content">
         <Head><title>Thank You | Daya Muneton</title><meta name="robots" content="noindex" /></Head>
         <section className="content-panel confirmation-panel">
            <PageIntro title="Welcome to your journey with art and emotions" />
            <div className="reading-flow">
               <p>Thank you for exploring the connection between emotions and art. Your support helps me bring emotional education to more people.</p>
               {isTestSite
                  ? <p>This was a test checkout. No payment was made or email sent.</p>
                  : <p>If you ordered a guide, check your inbox. For help, email <a href="mailto:info@dayamuneton.com">info@dayamuneton.com</a>.</p>}
               <p className="font-semibold text-ink">Daya Muneton</p>
            </div>
            <div className="portfolio-actions"><Link href="/ageofemotions" className="portfolio-button portfolio-button-primary">Explore emotional education</Link></div>
         </section>
      </div>
   );
}
