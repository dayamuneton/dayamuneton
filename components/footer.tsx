import Link from "next/link";
import { memo } from "react";
import ContactLinks from "./contactLinks";

export default memo(function Footer() {
   return (
      <footer className="site-footer">
         <div className="site-footer-inner">
            <div>
               <Link href="/" className="font-bold">Daya Muneton</Link>
               <p className="mt-1 text-sm text-muted">© Daya Muneton. All rights reserved.</p>
            </div>
            <nav aria-label="Footer" className="footer-links text-sm text-muted">
               <Link href="/about">About Daya</Link>
               <Link href="/legal/privacy-policy">Privacy Policy</Link>
               <Link href="/legal/terms-of-service">Terms of Service</Link>
            </nav>
            <div>
               <address className="text-sm">
                  <a href="mailto:info@dayamuneton.com">info@dayamuneton.com</a>
               </address>
               <ContactLinks />
            </div>
         </div>
      </footer>
   );
});
