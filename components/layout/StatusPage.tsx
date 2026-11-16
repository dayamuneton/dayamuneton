import Head from "next/head";
import Link from "next/link";
import PageIntro from "./PageIntro";

export default function StatusPage({ title, description }: { title: string; description: string }) {
   return (
      <div className="portfolio-content page-content">
         <Head><title>{title} | Daya Muneton</title><meta name="robots" content="noindex" /></Head>
         <section className="content-panel confirmation-panel">
            <PageIntro title={title} description={description} />
            <Link href="/" className="portfolio-button portfolio-button-primary">Back to the portfolio</Link>
         </section>
      </div>
   );
}
