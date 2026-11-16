import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/authContext";
import Disclosure from "@/components/ui/Disclosure";

export default function MakeAnOffer({ initialPrice }: { initialPrice: number }) {
   const { currentUser } = useAuth();
   const [pending, setPending] = useState(false);
   const [status, setStatus] = useState<"sent" | "error">();

   async function sendOffer(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (pending) return;
      const form = event.currentTarget;
      const fields = new FormData(form);
      const amount = Number(fields.get("offer"));
      const difference = initialPrice > 0 ? Math.round(100 - (amount / initialPrice) * 100) : 0;

      setPending(true);
      setStatus(undefined);
      try {
         const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: currentUser?.displayName || String(fields.get("name") ?? "").trim(),
               email: currentUser?.email || String(fields.get("email") ?? "").trim(),
               message: [
                  `Initial price: $${initialPrice}`, `Offer: $${amount}`, `Difference: ${difference}%`,
                  `Phone number: ${fields.get("phone") ?? ""}`, String(fields.get("message") ?? "").trim(),
               ].join("\n"),
            }),
         });
         if (!response.ok) throw new Error("Offer could not be sent");
         form.reset();
         setStatus("sent");
      } catch {
         setStatus("error");
      } finally {
         setPending(false);
      }
   }

   return (
      <Disclosure label="Make an offer">
         <form onSubmit={sendOffer} className="form-stack">
            <label>Offer (USD)<input name="offer" type="number" min="0.01" step="0.01" defaultValue={initialPrice || undefined} required /></label>
            {!currentUser?.email && <>
               <label>Name<input name="name" autoComplete="name" required /></label>
               <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            </>}
            <label>Phone number (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
            <label>Message (optional)<textarea name="message" rows={4} maxLength={5000} /></label>
            <label className="check-field"><input type="checkbox" required />
               <span>I accept the <Link href="/legal/terms-of-service" target="_blank" className="form-link">terms and conditions</Link>.</span>
            </label>
            <button type="submit" disabled={pending} className="portfolio-button portfolio-button-primary">
               {pending ? "Sending offer…" : "Submit my offer"}
            </button>
            {status === "sent" && <p role="status" className="success-feedback">Thank you. Your offer was sent.</p>}
            {status === "error" && <p className="form-feedback" role="alert">Couldn’t send your offer. Please try again.</p>}
         </form>
      </Disclosure>
   );
}
