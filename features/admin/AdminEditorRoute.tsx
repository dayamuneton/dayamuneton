import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore/lite";
import AdminPage from "./AdminPage";
import { catalogCollections, catalogLabels, type CatalogKind } from "./catalogConfig";
import PageSkeleton from "@/components/ui/PageSkeleton";

export type AdminDocument = DocumentData & { id: string };
type EditorState = { kind: "ready"; product: AdminDocument | null } | { kind: "missing" | "failed" };
const editorLoading = () => <PageSkeleton kind="form" label="Loading editor…" />;
const CatalogEditor = dynamic(() => import("./CatalogEditor"), { loading: editorLoading });

function EditorBody({ kind, id }: { kind: CatalogKind; id: string }) {
   const [result, setResult] = useState<EditorState>();
   const [attempt, setAttempt] = useState(0);
   useEffect(() => {
      if (id === "new" || id.includes("/")) return;
      let active = true;
      void (async () => {
         try {
            const [{ doc, getDoc }, { db }] = await Promise.all([
               import("firebase/firestore/lite"), import("@/integrations/firebase/firestore-lite"),
            ]);
            const snapshot = await getDoc(doc(db, catalogCollections[kind], id));
            if (!active) return;
            setResult(snapshot.exists()
               ? { kind: "ready", product: { ...snapshot.data(), id: snapshot.id } }
               : { kind: "missing" });
         } catch {
            if (active) setResult({ kind: "failed" });
         }
      })();
      return () => { active = false; };
   }, [id, kind, attempt]);

   const state: EditorState | undefined = id === "new" ? { kind: "ready", product: null }
      : id.includes("/") ? { kind: "missing" } : result;

   if (!state) return <PageSkeleton kind="form" label="Loading product…" />;
   if (state.kind === "missing") {
      return <div className="content-panel"><p>This item could not be found.</p>
         <Link className="form-link" href={`/admin/${kind}`}>Back to {kind}</Link></div>;
   }
   if (state.kind === "failed") {
      return <p className="form-feedback" role="alert">Couldn’t load this item.{" "}
         <button className="underline" onClick={() => { setResult(undefined); setAttempt((value) => value + 1); }}>Try again</button>
      </p>;
   }
   if (state.kind !== "ready") return null;
   return <CatalogEditor kind={kind} product={state.product} />;
}

export default function AdminEditorRoute({ kind }: { kind: CatalogKind }) {
   const { query } = useRouter();
   const id = typeof query.product === "string" ? query.product : undefined;
   return (
      <AdminPage title={`${id === "new" ? "Add" : "Edit"} ${catalogLabels[kind]}`}>
         {id ? <EditorBody key={id} kind={kind} id={id} /> : <PageSkeleton kind="form" label="Loading editor…" />}
      </AdminPage>
   );
}
