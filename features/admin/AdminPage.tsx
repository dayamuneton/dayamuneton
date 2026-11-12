import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import PageIntro from "@/components/layout/PageIntro";
import WithAuth from "@/components/withAuth";

const sections = [
   { href: "/admin", title: "Overview" },
   { href: "/admin/paintings", title: "Paintings" },
   { href: "/admin/guides", title: "Guides" },
];

export default function AdminPage({ title, children }: { title: string; children: ReactNode }) {
   const { pathname } = useRouter();
   return (
      <>
         <Head><title>{title} | Daya Muneton Admin</title><meta name="robots" content="noindex" /></Head>
         <WithAuth>
            <div className="portfolio-content admin-content">
               <nav aria-label="Admin navigation" className="admin-nav">
                  {sections.map(({ href, title }) => (
                     <Link key={href} href={href} prefetch={false} aria-current={href === pathname ? "page" : undefined}>{title}</Link>
                  ))}
               </nav>
               <PageIntro title={title} />
               {children}
            </div>
         </WithAuth>
      </>
   );
}
