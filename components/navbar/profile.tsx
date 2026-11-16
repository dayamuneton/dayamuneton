import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId, useRef, useState } from "react";
import { MdPerson } from "react-icons/md";
import { useClickOutside } from "@/hooks/clickOutside";

export default function NavbarProfile({ size }: { size?: string }) {
   const { currentUser, logout } = useAuth();
   const { asPath } = useRouter();
   const [open, setOpen] = useState(false);
   const profileRef = useRef<HTMLDivElement>(null);
   const trigger = useRef<HTMLButtonElement>(null);
   const panelId = useId();
   useClickOutside(profileRef, () => setOpen(false));

   if (!currentUser) {
      return (
         <Link href={{ pathname: "/auth/login", query: { src: asPath } }}
            prefetch={false} aria-label="Sign in or create an account" className="site-nav-icon">
            <MdPerson size={size} aria-hidden="true" />
         </Link>
      );
   }

   return (
      <div ref={profileRef} className="relative" onKeyDown={(event) => {
         if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            trigger.current?.focus();
         }
      }}>
         <button ref={trigger} type="button" className="site-nav-icon" aria-label="Your account"
            aria-controls={panelId} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <MdPerson size={size} aria-hidden="true" />
         </button>
         <div id={panelId} hidden={!open} className="site-account-panel">
            <p className="break-all font-medium">{currentUser.email}</p>
            <button type="button" className="mt-2 min-h-11 font-semibold text-accent" onClick={async () => {
               await logout();
               setOpen(false);
            }}>Log out</button>
         </div>
      </div>
   );
}
