import { useAuth } from "@/context/authContext";
import { auth, db } from "@/integrations/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { updateProfile } from "firebase/auth";
import { useClickOutside } from "@/hooks/clickOutside";

function NavbarProfile({
   className,
   size,
}: {
   className?: string;
   size?: string;
}) {
   const { currentUser, logout } = useAuth();
   const [showUserDropdown, setShowUserDropdown] = useState(false);
   const router = useRouter();

   const toggleUserDropdown = () =>
      setShowUserDropdown((showUserDropdown) => !showUserDropdown);

   const redirectToAuth = () => {
      if (currentUser) return;

      const url = `/auth/signup?src=${router.asPath}`;

      router.replace(url);
   };

   const profileRef = useRef<HTMLDivElement>(null);
   useClickOutside(profileRef, () => {
      setShowUserDropdown(false);
   });

   return (
      <div
         ref={profileRef}
         onClick={redirectToAuth}
         className={`${className}  flex items-center mx-1`}
      >
         <PersonIcon
            onClick={toggleUserDropdown}
            className="text-gray-700 cursor-pointer hover:drop-shadow-lg"
            sx={{
               fontSize: size,
            }}
         />
         {showUserDropdown && currentUser && (
            <div className="absolute bg-white rounded drop-shadow-lg top-8 right-0 text-sm p-2 z-[99999]">
               <div>
                  <p className="text-base font-medium text-gray-800">
                     {currentUser?.email}
                  </p>
                  <div className="flex flex-col font-thin">
                     {/* {profile?.isMember && <p>miembro</p>} */}
                  </div>
               </div>
               <div className="flex flex-col pt-2 mt-2 text-blue-700 border-t-2">
                  {/* <Link href={`/perfil`}>Perfil</Link> */}

                  <button onClick={logout} className="text-start">
                     Log Out
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default NavbarProfile;
