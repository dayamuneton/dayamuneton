import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { navigationLinks } from "./navigation-links";

export default function MobileNavigation() {
   const { pathname, events } = useRouter();
   const panel = useRef<HTMLDialogElement>(null);
   const trigger = useRef<HTMLButtonElement>(null);
   const [open, setOpen] = useState(false);
   const panelId = useId();
   const titleId = useId();

   const closeMenu = useCallback((restoreFocus = true) => {
      if (!panel.current?.open) return;
      panel.current.close();
      setOpen(false);
      if (restoreFocus) trigger.current?.focus();
   }, []);

   useEffect(() => {
      const breakpoint = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-navigation").trim();
      const desktop = window.matchMedia(`(min-width: ${breakpoint})`);
      const dismissOnResize = () => {
         if (desktop.matches && panel.current?.open) {
            closeMenu(false);
            document.getElementById("main-content")?.focus();
         }
      };
      const dismissOnNavigation = () => closeMenu(false);
      desktop.addEventListener("change", dismissOnResize);
      events.on("routeChangeStart", dismissOnNavigation);
      return () => {
         desktop.removeEventListener("change", dismissOnResize);
         events.off("routeChangeStart", dismissOnNavigation);
      };
   }, [closeMenu, events]);

   return (
      <>
         <button ref={trigger} type="button" className="site-menu-button" aria-label="Menu"
            aria-haspopup="dialog" aria-controls={panelId} aria-expanded={open}
            onClick={() => {
               if (panel.current?.open) closeMenu();
               else {
                  panel.current?.showModal();
                  setOpen(true);
               }
            }}>
            <FiMenu size="1.75rem" aria-hidden="true" />
         </button>
         <dialog ref={panel} id={panelId} className="mobile-navigation" aria-labelledby={titleId}
            onCancel={(event) => { event.preventDefault(); closeMenu(); }}
            onClose={() => { if (!panel.current?.open) setOpen(false); }}
            onKeyDown={(event) => {
               if (event.key !== "Tab") return;
               const controls = event.currentTarget.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a[href], button");
               const first = controls[0];
               const last = controls[controls.length - 1];
               if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
               } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
               }
            }}
            onClick={(event) => {
               if (event.target === event.currentTarget && event.clientX > event.currentTarget.getBoundingClientRect().right) closeMenu();
            }}>
            <header className="mobile-navigation-header">
               <h2 id={titleId}>Daya Muneton</h2>
               <button type="button" aria-label="Close menu" onClick={() => closeMenu()} autoFocus>
                  <FiX size="1.5rem" aria-hidden="true" />
               </button>
            </header>
            <ul className="mobile-navigation-links">
               {[{ href: "/", label: "Home" }, ...navigationLinks].map(({ href, label }) => (
                  <li key={href}>
                     <Link href={href} aria-current={pathname === href ? "page" : undefined}
                        data-section-active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
                        onClick={() => closeMenu(pathname === href)}>
                        {label}
                     </Link>
                  </li>
               ))}
            </ul>
         </dialog>
      </>
   );
}
