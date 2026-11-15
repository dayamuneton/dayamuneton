import { useAuth } from "@/context/authContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ContinueWith({ className }: { className?: string }) {
   const { loginWithGoogle } = useAuth();
   const [pending, setPending] = useState(false);
   const [failed, setFailed] = useState(false);

   async function signIn() {
      setPending(true);
      setFailed(false);
      try {
         setFailed(Boolean(await loginWithGoogle()));
      } catch {
         setFailed(true);
      } finally {
         setPending(false);
      }
   }

   return (
      <div className={className}>
         <button type="button" onClick={signIn} disabled={pending}
            className="portfolio-button portfolio-button-secondary w-full gap-2">
            <Image src="/icons/google.png" alt="" width={20} height={20} />
            {pending ? "Connecting…" : "Continue with Google"}
         </button>
         {failed && <p role="alert" className="form-feedback mt-3">Google sign-in couldn’t finish. Try again or sign in with email.</p>}
         <p className="mt-3 text-sm text-muted">
            By continuing, you agree to our{" "}
            <Link className="form-link" href="/legal/terms-of-service">Terms of Service</Link>
            {" and "}
            <Link className="form-link" href="/legal/privacy-policy">Privacy Policy</Link>.
         </p>
      </div>
   );
}
