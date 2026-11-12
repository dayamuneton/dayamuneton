import Link from "next/link";
import AdminPage from "@/features/admin/AdminPage";

export default function AdminHome() {
   return (
      <AdminPage title="Manage the portfolio">
         <div className="admin-grid">
            <Link href="/admin/paintings" prefetch={false} className="content-panel">
               <h2 className="text-xl font-bold">Paintings</h2>
               <p className="mt-2 text-muted">Manage artwork, images, prices, and availability.</p>
            </Link>
            <Link href="/admin/guides" prefetch={false} className="content-panel">
               <h2 className="text-xl font-bold">Guides</h2>
               <p className="mt-2 text-muted">Manage guides, variants, and featured images.</p>
            </Link>
         </div>
      </AdminPage>
   );
}
