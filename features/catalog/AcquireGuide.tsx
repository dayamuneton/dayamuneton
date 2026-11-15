import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/authContext";
import type { GuiaProduct, GuiaProductVariant } from "@/models/guiaProductModel";
import Disclosure from "@/components/ui/Disclosure";

export default function AcquireGuide({ product, variant }: { product: GuiaProduct; variant?: GuiaProductVariant }) {
   const router = useRouter();
   const { currentUser } = useAuth();
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");
   const label = product.price === 0 ? "Acquire Guide" : "Buy this guide";

   async function startCheckout(email: string, name: string) {
      if (pending) return;
      setPending(true);
      setError("");

      try {
         const { createPdfsCheckout } = await import("@/handlers/orders/createPdfsCheckout");
         const response = await createPdfsCheckout({
            cartItems: [{
               ...product,
               ...(variant && {
                  name: `${product.name} (${variant.title})`,
                  mailerlite_group: variant.mailerlite_group,
                  variantId: variant.id,
               }),
            }],
            cancel_url: router.asPath,
            email,
            name: name.trim() || email.split("@")[0],
            success_url: "/thankyou",
         });
         if (!response.url) throw new Error("Missing checkout URL");
         await router.push(response.url);
      } catch {
         setError("Couldn’t open checkout. Please try again.");
      } finally {
         setPending(false);
      }
   }

   function submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const fields = new FormData(event.currentTarget);
      void startCheckout(String(fields.get("email") ?? "").trim(), String(fields.get("name") ?? ""));
   }

   const feedback = error && <p className="form-feedback" role="alert">{error}</p>;
   if (currentUser?.email) {
      const { email, displayName } = currentUser;
      return (
         <div className="detail-actions">
            <button type="button" disabled={pending} onClick={() => void startCheckout(email, displayName || "")}
               className="portfolio-button portfolio-button-primary">
               {pending ? "Opening checkout…" : label}
            </button>
            {feedback}
         </div>
      );
   }

   return (
      <Disclosure label={label}>
         <form onSubmit={submit} className="form-stack">
            <label>Name<input name="name" autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label className="check-field"><input type="checkbox" required />
               <span>I accept the <Link href="/legal/terms-of-service" target="_blank" className="form-link">terms and conditions</Link>.</span>
            </label>
            <button type="submit" disabled={pending} className="portfolio-button portfolio-button-primary">
               {pending ? "Opening checkout…" : label}
            </button>
            {feedback}
         </form>
      </Disclosure>
   );
}
