import Navbar from "@/components/navbar/navbar";
import WithAuth from "@/components/withAuth";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/authContext";
import ProductsTable from "@/components/productsTable";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";
import { NextPage } from "next";
import Footer from "@/components/footer";
import Link from "next/link";

export async function getServerSideProps() {
   const q = query(
      collection(db, "pdfproducts"),
      orderBy("date", "desc"),
      limit(10)
   );
   const products = await getDocs(q);
   const productsData = products.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));
   return {
      props: {
         products: productsData,
      },
   };
}

function AdminGuides(props: any) {
   const { products } = props;

   return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg">
         <Head>
            <title>Guides | Admin | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />

         <div className="flex flex-col mt-12 mb-auto">
            {/* <AddProduct /> */}
            <div>
               <Link
                  href="/admin/paintings"
                  className="px-6 py-2 mb-1 font-medium rounded bg-slate-100"
               >
                  Paintings
               </Link>

               <Link
                  href="/admin/guides/new"
                  className="px-6 py-2 mb-1 ml-auto font-medium rounded bg-slate-100"
               >
                  Add Product
               </Link>
            </div>
            <ProductsTable type={"guides"} products={products} />
         </div>
         <Footer />
      </div>
   );
}

function ProtectedPage(props: any) {
   return <WithAuth Component={AdminGuides} props={props} />;
}

export default ProtectedPage;
