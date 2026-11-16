import Link from "next/link";
import { useEffect, useState } from "react";
import type { QueryDocumentSnapshot } from "firebase/firestore/lite";
import AdminCatalogList from "./AdminCatalogList";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { catalogCollections, catalogLabels, type CatalogKind } from "./catalogConfig";

const pageSize = 24;

async function getCatalogPage(kind: CatalogKind, cursor?: QueryDocumentSnapshot) {
   const [{ collection, query, limit, orderBy, startAfter, getDocs }, { db }] = await Promise.all([
      import("firebase/firestore/lite"), import("@/integrations/firebase/firestore-lite"),
   ]);
   const filters = [orderBy("date", "desc"), limit(pageSize + 1)];
   const snapshot = await getDocs(query(collection(db, catalogCollections[kind]), ...filters, ...(cursor ? [startAfter(cursor)] : [])));
   return { docs: snapshot.docs.slice(0, pageSize), hasMore: snapshot.size > pageSize };
}

export default function AdminCatalog({ kind }: { kind: CatalogKind }) {
   const [docs, setDocs] = useState<QueryDocumentSnapshot[]>([]);
   const [hasMore, setHasMore] = useState(false);
   const [loading, setLoading] = useState(true);
   const [failed, setFailed] = useState(false);
   const [attempt, setAttempt] = useState(0);

   useEffect(() => {
      let active = true;
      void getCatalogPage(kind).then((page) => {
         if (!active) return;
         setDocs(page.docs);
         setHasMore(page.hasMore);
      }).catch(() => { if (active) setFailed(true); })
         .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
   }, [kind, attempt]);

   async function loadMore() {
      setLoading(true);
      setFailed(false);
      try {
         const page = await getCatalogPage(kind, docs.at(-1));
         setDocs((current) => [...current, ...page.docs]);
         setHasMore(page.hasMore);
      } catch {
         setFailed(true);
      } finally {
         setLoading(false);
      }
   }

   return (
      <>
         <div className="mb-5">
            <Link href={`/admin/${kind}/new`} prefetch={false} className="portfolio-button portfolio-button-primary">
               Add {catalogLabels[kind]}
            </Link>
         </div>
         {docs.length > 0 && <AdminCatalogList type={kind} products={docs.map((item) => ({ ...item.data(), id: item.id }))} />}
         {!docs.length && loading && <PageSkeleton kind="admin" label={`Loading ${kind}…`} />}
         {!loading && !failed && !docs.length && <p className="content-panel">No {kind} yet.</p>}
         {failed && <p className="form-feedback" role="alert">
            Couldn’t load {kind}.{" "}
            <button type="button" className="underline" onClick={() => {
               if (docs.length) { void loadMore(); return; }
               setFailed(false);
               setLoading(true);
               setAttempt((value) => value + 1);
            }}>Try again</button>
         </p>}
         {hasMore && !failed && <button type="button" className="portfolio-button portfolio-button-secondary mt-4" disabled={loading}
            onClick={loadMore}>{loading ? "Loading…" : `Load more ${kind}`}</button>}
      </>
   );
}
