import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import sanitizeHtml from "sanitize-html";
import ArtworkGallery from "@/components/ui/ArtworkGallery";
import AcquireGuide from "@/components/acquireGuide";
import CartAction from "@/features/catalog/CartAction";
import { GuiaProduct } from "@/models/guiaProductModel";
import { guideCategories } from "@/features/catalog/categories";
import { findCatalogItem } from "@/features/catalog/data";

export const getServerSideProps = (async ({ params }) => {
   const category = guideCategories.find(({ slug }) => slug === params?.category);
   if (!category || typeof params?.pdfproduct !== "string") return { notFound: true };
   const snapshot = await findCatalogItem("pdfproducts", category.slug, params.pdfproduct);
   if (!snapshot) return { notFound: true };
   const data = snapshot.data();
   const product = { ...new GuiaProduct({ ...data, id: snapshot.id, handle: data.handle || snapshot.id }) };
   product.beneficts = sanitizeHtml(product.beneficts, {
      allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"],
      allowedAttributes: { a: ["href"] },
      allowedSchemes: ["http", "https", "mailto"],
      allowProtocolRelative: false,
   });
   if (!/^https?:\/\//i.test(product.externalLink)) product.externalLink = "";
   return { props: { routeKey: snapshot.id, product, category } };
}) satisfies GetServerSideProps;

export default function Guide({ product, category }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const router = useRouter();
   const [selection, setSelection] = useState<{ variantId?: string; image: string }>();
   const variant = product.variants.find(({ title }) => title === router.query.variant) || product.variants[0];
   const initialImage = variant?.image || product.featuredImage || product.images[0];
   const selected = selection && selection.variantId === variant?.id ? selection.image : initialImage;
   const images = [initialImage, product.featuredImage, ...product.images].filter(Boolean);

   return (
      <div className="portfolio-content page-content">
         <Head><title>{product.name} | Daya Muneton</title><meta name="description" content={product.description} /></Head>
         <Link href={"/ageofemotions/" + category.slug} className="back-link">← {category.title}</Link>
         <div className="detail-grid">
            <div className="detail-heading"><h1 className="page-title">{product.name}</h1></div>
            <div className="detail-gallery">
               <ArtworkGallery images={images} selected={selected} title={product.name}
                  onSelect={(image) => setSelection({ variantId: variant?.id, image })} />
            </div>
            <div className="content-panel detail-summary">
               <p className="detail-price">{product.price > 0
                  ? product.price.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "Free guide"}</p>
               {product.variants.length > 0 && <div className="detail-variants" role="group" aria-label="Guide options">
                  {product.variants.map((option) => (
                     <button key={option.id} type="button" aria-pressed={variant?.id === option.id}
                        onClick={() => {
                           void router.replace({ pathname: router.pathname, query: { ...router.query, variant: option.title } }, undefined, { shallow: true, scroll: false });
                        }}>{option.title}</button>
                  ))}
               </div>}
               {product.externalLink
                  ? <a href={product.externalLink} className="portfolio-button portfolio-button-primary">{product.externalLinkText || "Buy this guide"}</a>
                  : <div className="detail-actions"><AcquireGuide product={product} variant={variant} /><CartAction product={product} variant={variant} /></div>}
            </div>
            <div className="content-panel detail-copy reading-flow">
               <h2>About this guide</h2>
               <p>{product.description}</p>
               {product.beneficts && <><h2>What you’ll explore</h2><div dangerouslySetInnerHTML={{ __html: product.beneficts }} /></>}
            </div>
         </div>
      </div>
   );
}
