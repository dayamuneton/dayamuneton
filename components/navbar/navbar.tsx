import Link from "next/link";
import { useRouter } from "next/router";
import { ShoppingCart } from "./shoppingCart";
import NavbarProfile from "./profile";
import MobileNavigation from "./MobileNavigation";
import { navigationLinks } from "./navigation-links";

export default function Navbar() {
   const { pathname } = useRouter();

   return (
      <nav aria-label="Main navigation" className="site-nav">
         <div className="site-nav-row">
            <MobileNavigation />
            <Link href="/" className="site-nav-brand" aria-current={pathname === "/" ? "page" : undefined}>
               Daya Muneton
            </Link>
            <ul className="site-nav-links">
               {navigationLinks.map(({ href, label }) => (
                  <li key={href}>
                     <Link href={href} aria-current={pathname === href ? "page" : undefined}
                        data-section-active={pathname.startsWith(href)}>
                        {label}
                     </Link>
                  </li>
               ))}
            </ul>
            <div className="site-nav-actions">
               <ShoppingCart size="1.4rem" />
               <NavbarProfile size="1.4rem" />
            </div>
         </div>
      </nav>
   );
}
