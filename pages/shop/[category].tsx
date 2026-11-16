import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ArtworkImage from "@/components/ui/ArtworkImage";
import CatalogGrid from "@/features/catalog/CatalogGrid";
import { paintingCategories } from "@/features/catalog/categories";
import { listCollection } from "@/features/catalog/data";

export const getServerSideProps = (async ({ params }) => {
   const category = paintingCategories.find(({ slug }) => slug === params?.category);
   if (!category) return { notFound: true };
   return { props: { category, items: await listCollection("products", category.slug) } };
}) satisfies GetServerSideProps;

export default function PaintingCollection({ category, items }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const memorial = category.slug === "memorials";
   const description = memorial
      ? "A Latin Gift is a mosaic where each piece represents the life experiences of the Latin community through a journey across our musical history. Purchases and commissions help this cultural project continue."
      : "Purchases and custom commissions help support Daya’s work in art for emotional education.";
   return (
      <>
         <Head><title>{category.title} | Daya Muneton</title><meta name="description" content={description} /></Head>
         <div className="portfolio-content page-content collection-page">
            <div className="gallery-banner collection-banner">
               <ArtworkImage src={category.image} alt="" sizes="(min-width: 1280px) 1216px, 95vw" priority />
            </div>
            <Link href="/shop" className="back-link">← Art shop</Link>
            <PageIntro title={category.title} description={description}>
               {memorial && <a className="portfolio-button portfolio-button-secondary" href="https://unregalolatino.com/">Explore A Latin Gift</a>}
            </PageIntro>
            {!memorial && <nav aria-label="Art collections" className="collection-nav">
               {paintingCategories.filter(({ slug }) => slug !== "memorials").map(({ slug, title }) => (
                  <Link key={slug} href={"/shop/" + slug} aria-current={category.slug === slug ? "page" : undefined}>{title}</Link>
               ))}
            </nav>}
            {items.length > 0 ? <CatalogGrid items={items} basePath={"/shop/" + category.slug} /> : (
               <div className="content-panel empty-panel">
                  <h2>No artworks listed</h2>
                  <p>You can still ask Daya about commissioning a piece.</p>
                  <Link href="/shop/custom" className="portfolio-button portfolio-button-secondary">Ask about a commission</Link>
               </div>
            )}
         </div>
      </>
   );
}
