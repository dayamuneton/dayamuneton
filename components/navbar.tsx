import Link from "next/link";
import React, { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useClickOutside } from "@/hooks/clickOutside";

function Navbar() {
   const [showNavbar, setShowNavbar] = useState(false);
   const navRef = useRef<HTMLUListElement>(null);

   useClickOutside(navRef, () => setShowNavbar(false));

   return (
      <nav className="z-[1000] top-0 w-full font-medium text-white ">
         <MenuIcon
            className="fixed text-black cursor-pointer left-2 top-2 sm:!hidden "
            sx={{
               fontSize: "2.3rem",
            }}
            onClick={() => setShowNavbar((show) => !show)}
         />
         <ul
            className={`bg-[#4a23a9] min-h-screen sm:min-h-0 sm:absolute fixed pl-4 pr-8 pt-2 flex-col sm:flex-row gap-4 sm:pt-1 top-0 p-1 flex  ease-in-out duration-300 sm:left-0 ${
               showNavbar ? "left-0" : "-left-full"
            }`}
            ref={navRef}
         >
            <Link href="/" className="hover:underline hover:scale-[1.01]">
               Daya Muneton
            </Link>
            <Link
               href="/community"
               className="hover:underline hover:scale-[1.01]"
            >
               Community
            </Link>
            <Link href="/shop" className="hover:underline hover:scale-[1.01]">
               Shop
            </Link>
            <Link
               href="/ageofemotions"
               className="hover:underline hover:scale-[1.01]"
            >
               My Notes
            </Link>
         </ul>
      </nav>
   );
}

export default Navbar;
