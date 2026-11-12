import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import CatalogGrid from "@/features/catalog/CatalogGrid";
import { guideCategories } from "@/features/catalog/categories";
import { listCollection } from "@/features/catalog/data";

export const getServerSideProps = (async ({ params }) => {
   const category = guideCategories.find(({ slug }) => slug === params?.category);
   if (!category) return { notFound: true };
   return { props: { category, items: await listCollection("pdfproducts", category.slug) } };
}) satisfies GetServerSideProps;

export default function GuideCollection({ category, items }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   return (
      <div className="portfolio-content page-content">
         <Head><title>{category.title} | Daya Muneton</title><meta name="description" content={category.summary} /></Head>
         <Link href="/ageofemotions" className="back-link">← Emotional education</Link>
         <PageIntro title={category.title} description={category.summary} />
         <nav className="collection-nav" aria-label="Guide categories">
            {guideCategories.map(({ slug, title }) => (
               <Link key={slug} href={"/ageofemotions/" + slug} aria-current={category.slug === slug ? "page" : undefined}>{title}</Link>
            ))}
         </nav>
         {items.length > 0 ? <CatalogGrid items={items} basePath={"/ageofemotions/" + category.slug} /> : (
            <div className="content-panel empty-panel">
               <h2>No guides listed</h2>
               <p>Explore the other categories to find a guide.</p>
               <Link href="/ageofemotions" className="portfolio-button portfolio-button-secondary">Browse other categories</Link>
            </div>
         )}
      </div>
   );
}
