import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      if (!currentUser) {
         router.push("/auth/login");
         return;
      }
      const checkAdminStatus = async () => {
         const adminDoc = doc(db, "admins", currentUser.email);
         const adminSnapshot = await getDoc(adminDoc);
         if (!adminSnapshot.exists()) {
            router.replace("/");
         } else {
            setIsAdmin(true);
         }
      };
      checkAdminStatus();
   }, [currentUser, router, logout]);

   return isAdmin ? <Component {...props} /> : <p>Loading...</p>;
};

export default WithAuth;
