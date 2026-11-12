import AdminPage from "@/features/admin/AdminPage";
import AdminCatalog from "@/features/admin/AdminCatalog";

export default function Guides() {
   return <AdminPage title="Guides"><AdminCatalog kind="guides" /></AdminPage>;
}
