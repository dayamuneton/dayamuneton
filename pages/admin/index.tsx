import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import WithAuth from "@/components/withAuth";
import Head from "next/head";
import Link from "next/link";
import React from "react";

function Admin() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg">
         <Head>
            <title>Admin | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col items-center justify-center mb-auto mt-14">
            <div className="flex gap-2">
               <Link
                  href="/admin/paintings"
                  className="px-8 py-2 border-2 rounded-md hover:scale-[1.03]"
               >
                  Paintings
               </Link>
               <Link
                  href="/admin/guides"
                  className="px-8 py-2 border-2 rounded-md hover:scale-[1.03]"
               >
                  Guides
               </Link>
            </div>
         </div>
         <Footer />
      </div>
   );
}

function ProtectedPage(props: any) {
   return <WithAuth Component={Admin} props={props} />;
}

export default ProtectedPage;
