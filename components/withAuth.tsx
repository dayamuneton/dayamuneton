import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/authContext";
import PageSkeleton from "./ui/PageSkeleton";
import PageIntro from "./layout/PageIntro";

export default function WithAuth({ children }: { children: ReactNode }) {
   const { currentUser, authReady } = useAuth();
   const router = useRouter();
   const uid = currentUser?.uid;
   const email = currentUser?.email;
   const [access, setAccess] = useState<{ uid: string; status: "allowed" | "denied" | "failed" }>();
   const [attempt, setAttempt] = useState(0);

   useEffect(() => {
      if (!authReady || !router.isReady || currentUser) return;
      void router.replace({ pathname: "/auth/login", query: { src: router.asPath } });
   }, [authReady, currentUser, router]);

   useEffect(() => {
      if (!uid || !email) return;
      let active = true;
      void (async () => {
         try {
            const [{ doc, getDoc }, { db }] = await Promise.all([
               import("firebase/firestore/lite"),
               import("@/integrations/firebase/firestore-lite"),
            ]);
            const result = await getDoc(doc(db, "admins", email));
            if (active) setAccess({ uid, status: result.exists() ? "allowed" : "denied" });
         } catch {
            if (active) setAccess({ uid, status: "failed" });
         }
      })();
      return () => { active = false; };
   }, [uid, email, attempt]);

   if (uid && access?.uid === uid && access.status === "allowed") return children;
   if (currentUser && (!email || (access?.uid === uid && access?.status === "denied"))) {
      return <div className="portfolio-content page-content"><PageIntro title="Admin access required"
         description="Sign in with an account that has permission to manage the portfolio.">
         <Link href="/" className="portfolio-button portfolio-button-secondary">Back to portfolio</Link>
      </PageIntro></div>;
   }
   if (uid && access?.uid === uid && access.status === "failed") {
      return <div className="portfolio-content page-content"><PageIntro title="Couldn’t check admin access">
         <button type="button" className="portfolio-button portfolio-button-primary" onClick={() => {
            setAccess(undefined);
            setAttempt((value) => value + 1);
         }}>Try again</button>
      </PageIntro></div>;
   }
   return <PageSkeleton kind="admin" label={authReady && !currentUser ? "Taking you to sign in…" : "Checking admin access…"} />;
}
