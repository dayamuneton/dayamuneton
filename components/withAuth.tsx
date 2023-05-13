import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import { useAuth } from "@/context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";

interface WithAuthComponentProps {
   Component: any;
   props: any;
}

const WithAuth = ({ Component, props }: WithAuthComponentProps) => {
   const { currentUser, logout } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!currentUser) {
         router.push("/login");
         return;
      }
      const checkAdminStatus = async () => {
         const adminDoc = doc(db, "admins", currentUser.email);
         const adminSnapshot = await getDoc(adminDoc);
         if (!adminSnapshot.exists()) {
            await logout();
         }
      };
      checkAdminStatus();
   }, [currentUser, router, logout]);

   return currentUser ? <Component {...props} /> : null;
};

export default WithAuth;
