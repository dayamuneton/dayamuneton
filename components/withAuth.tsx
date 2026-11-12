import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";

interface WithAuthComponentProps {
   Component: any;
   props?: any;
}

const WithAuth = ({ Component, props }: WithAuthComponentProps) => {
   const { currentUser, authReady } = useAuth();
   const router = useRouter();
   const [adminUid, setAdminUid] = useState<string>();

   useEffect(() => {
      if (!authReady) return;
      if (!currentUser?.email) {
         router.push("/auth/login");
         return;
      }
      let active = true;
      getDoc(doc(db, "admins", currentUser.email))
         .then((snapshot) => {
            if (!active) return;
            if (snapshot.exists()) setAdminUid(currentUser.uid);
            else void router.replace("/");
         })
         .catch(() => { if (active) void router.replace("/"); });
      return () => { active = false; };
   }, [authReady, currentUser, router]);

   return currentUser && currentUser.uid === adminUid ? <Component {...props} /> : <p>Loading...</p>;
};

export default WithAuth;
