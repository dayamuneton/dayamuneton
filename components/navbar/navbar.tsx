import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useClickOutside } from "@/hooks/clickOutside";
import { ShoppingCart } from "./shoppingCart";
import NavbarProfile from "./profile";

const links = [
   { href: "/community", label: "Community" },
   { href: "/shop", label: "Shop" },
   { href: "/ageofemotions", label: "Emotional Education" },
];

export default function Navbar() {
   const { pathname, events } = useRouter();
   const [showNavbar, setShowNavbar] = useState(false);
   const navRef = useRef<HTMLElement>(null);
   const menuButton = useRef<HTMLButtonElement>(null);

   useClickOutside(navRef, () => setShowNavbar(false));
   useEffect(() => {
      if (showNavbar) navRef.current?.querySelector<HTMLAnchorElement>(".site-nav-links a")?.focus();
   }, [showNavbar]);
   useEffect(() => {
      const closeMenu = () => setShowNavbar(false);
      events.on("routeChangeComplete", closeMenu);
      return () => events.off("routeChangeComplete", closeMenu);
   }, [events]);

   return (
      <nav ref={navRef} aria-label="Main navigation" className="site-nav"
         onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setShowNavbar(false);
         }}
         onKeyDown={(event) => {
            if (!event.defaultPrevented && event.key === "Escape" && showNavbar) {
               event.preventDefault();
               setShowNavbar(false);
               menuButton.current?.focus();
            }
         }}>
         <div className="site-nav-row">
            <Link href="/" className="site-nav-brand" aria-current={pathname === "/" ? "page" : undefined}>
               Daya Muneton
            </Link>
            <ul id="main-navigation-links" className="site-nav-links" data-open={showNavbar}>
               {links.map(({ href, label }) => (
                  <li key={href}>
                     <Link href={href} aria-current={pathname === href ? "page" : undefined}
                        data-section-active={pathname.startsWith(href)}
                        onClick={() => {
                           if (showNavbar && pathname === href) {
                              setShowNavbar(false);
                              menuButton.current?.focus();
                           }
                        }}>
                        {label}
                     </Link>
                  </li>
               ))}
            </ul>
            <div className="site-nav-actions">
               <ShoppingCart size="1.4rem" />
               <NavbarProfile size="1.4rem" />
               <button ref={menuButton} type="button" className="site-menu-button"
                  aria-controls="main-navigation-links" aria-expanded={showNavbar}
                  onClick={() => setShowNavbar((open) => !open)}>
                  Menu
               </button>
            </div>
         </div>
      </nav>
   );
}
