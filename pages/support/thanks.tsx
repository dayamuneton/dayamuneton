import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import { isLocalSite } from "@/config/site-environment";

export default function SupportThanks() {
   return (
      <div className="portfolio-content page-content">
         <Head><title>Thank You for Your Support | Daya Muneton</title><meta name="robots" content="noindex" /></Head>
         <section className="content-panel confirmation-panel">
            <PageIntro title="Thank you for your support" description="Your support helps make art and emotional education more accessible." />
            {isLocalSite && <p className="text-muted mb-4">This was a test checkout. No payment was made.</p>}
            <Link href="/" className="portfolio-button portfolio-button-primary">Back to the portfolio</Link>
         </section>
      </div>
   );
}
