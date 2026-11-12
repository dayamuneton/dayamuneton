import Link from "next/link";
import { useState, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useClickOutside } from "@/hooks/clickOutside";
import { ShoppingCart } from "./shoppingCart";
import NavbarProfile from "./profile";

function Navbar() {
   const [showNavbar, setShowNavbar] = useState(false);
   const navRef = useRef<HTMLElement>(null);
   const menuButton = useRef<HTMLButtonElement>(null);

   useClickOutside(navRef, () => setShowNavbar(false));

   return (
      <nav
         ref={navRef}
         aria-label="Main navigation"
         className="z-[1000] top-0 w-full font-medium text-white"
         onKeyDown={(event) => {
            if (event.key === "Escape" && showNavbar) {
               setShowNavbar(false);
               menuButton.current?.focus();
            }
         }}
      >
         <button
            ref={menuButton}
            type="button"
            aria-label="Menu"
            aria-controls="main-navigation-links"
            aria-expanded={showNavbar}
            className="fixed text-black cursor-pointer left-2 top-2 sm:hidden"
            onClick={() => setShowNavbar((show) => !show)}
         >
            <MenuIcon sx={{ fontSize: "2.3rem" }} />
         </button>
         <div className="fixed flex top-2 right-2">
            <ShoppingCart size="1.7rem" className="" />
            <NavbarProfile size="1.7rem" className="" />
         </div>
         <ul
            id="main-navigation-links"
            className={`bg-[#4a23a9] min-h-screen sm:min-h-0 sm:absolute fixed pl-4 pr-8 pt-2 flex-col sm:flex-row gap-4 sm:pt-1 top-0 p-1 flex ease-in-out duration-300 motion-reduce:transition-none sm:left-0 ${
               showNavbar ? "left-0" : "-left-full max-sm:invisible"
            }`}
         >
            <li>
            <Link href="/" className="hover:underline hover:scale-[1.01]">
               Daya Muneton
            </Link>
            </li>
            <li>
            <Link
               href="/community"
               className="hover:underline hover:scale-[1.01]"
            >
               Community
            </Link>
            </li>
            <li>
            <Link href="/shop" className="hover:underline hover:scale-[1.01]">
               Shop
            </Link>
            </li>
            <li>
            <Link
               href="/ageofemotions"
               className="hover:underline hover:scale-[1.01]"
            >
               Emotional Education
            </Link>
            </li>
         </ul>
      </nav>
   );
}

export default Navbar;
