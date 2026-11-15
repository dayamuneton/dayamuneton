import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FiCheckCircle, FiImage, FiPackage, FiRotateCcw } from "react-icons/fi";
import ArtworkGallery from "@/components/ui/ArtworkGallery";
import MakeAnOffer from "@/components/makeAnOffer";
import CartAction from "@/features/catalog/CartAction";
import { paintingCategories } from "@/features/catalog/categories";
import { findCatalogItem } from "@/features/catalog/data";
import { isSoldOut } from "@/features/catalog/availability";

export const getServerSideProps = (async ({ params }) => {
   const category = paintingCategories.find(({ slug }) => slug === params?.category);
   if (!category || typeof params?.artWork !== "string") return { notFound: true };
   const snapshot = await findCatalogItem("products", category.slug, params.artWork);
   if (!snapshot) return { notFound: true };
   const data = snapshot.data;
   return { props: { routeKey: snapshot.id, category, product: {
      id: snapshot.id,
      handle: data.handle || snapshot.id,
      name: data.name || "Untitled artwork",
      description: data.description || "",
      price: Number(data.price) || 0,
      images: (data.images || []) as string[],
      featuredImage: data.featuredImage || "",
      category: category.slug,
      techniques: (data.techniques || []) as string[],
      shippingInformation: data.shippingInformation || "",
      soldOut: isSoldOut(data),
   } } };
}) satisfies GetServerSideProps;

export default function Artwork({ product, category }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const initialImage = product.featuredImage || product.images[0];
   const [selected, setSelected] = useState(initialImage);
   return (
      <div className="portfolio-content page-content product-page">
         <Head><title>{product.name} | Daya Muneton</title><meta name="description" content={product.description} /></Head>
         <Link href={"/shop/" + category.slug} className="back-link">← {category.title}</Link>
         <div className="detail-grid original-product">
            <div className="detail-heading">
               <h1 className="page-title">{product.name}</h1>
               {product.techniques.length > 0 && <ul className="detail-tags" aria-label="Techniques">
                  {product.techniques.map((technique) => <li key={technique}>{technique}</li>)}
               </ul>}
            </div>
            <div className="detail-gallery">
               <ArtworkGallery images={product.featuredImage ? [product.featuredImage, ...product.images] : product.images}
                  sizes="(min-width: 1150px) 505px, (min-width: 760px) 48vw, calc(100vw - 64px)"
                  selected={selected} title={product.name} onSelect={setSelected} />
            </div>
            <div className="content-panel detail-summary">
               <p className="detail-price">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
               {product.soldOut ? <p className="text-muted">This original is sold out.</p> : <div className="detail-actions">
                  <MakeAnOffer initialPrice={product.price} />
                  <CartAction product={product} />
               </div>}
               <ul className="detail-facts">
                  <li><FiImage aria-hidden="true" /> Limited edition</li>
                  <li><FiCheckCircle aria-hidden="true" /> Certificate of authenticity</li>
                  <li><FiPackage aria-hidden="true" /> 7–10 day professional delivery</li>
                  <li><FiRotateCcw aria-hidden="true" /> Free 14-day returns</li>
               </ul>
            </div>
            <div className="content-panel detail-copy reading-flow">
               {product.description && <><h2>About the artwork</h2><p>{product.description}</p></>}
               {product.shippingInformation && <><h2>Shipping information</h2><p>{product.shippingInformation}</p></>}
               {!product.description && !product.shippingInformation && <p>Original artwork by Daya Muneton.</p>}
            </div>
         </div>
      </div>
   );
}
