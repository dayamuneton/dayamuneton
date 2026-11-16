import AdminPage from "@/features/admin/AdminPage";
import AdminCatalog from "@/features/admin/AdminCatalog";

export default function Paintings() {
   return <AdminPage title="Paintings"><AdminCatalog kind="paintings" /></AdminPage>;
}
