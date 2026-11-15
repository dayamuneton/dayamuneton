import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { FiChevronDown } from "react-icons/fi";
import { supportThanksPath } from "@/features/home/support";
import { useClickOutside } from "@/hooks/clickOutside";
import { dollarsToCents } from "@/integrations/stripe/line-items";

const tipOptions = [3, 5, 10, 20, 50];
const desktopSupport = "(min-width: 680px)";

export default function SupportMyWork() {
   const router = useRouter();
   const support = useRef<HTMLDivElement>(null);
   const dialog = useRef<HTMLDialogElement>(null);
   const trigger = useRef<HTMLButtonElement>(null);
   const activeRequest = useRef<AbortController | null>(null);
   const returnFocus = useRef(true);
   const dialogId = useId();
   const titleId = useId();
   const amountId = useId();
   const errorId = useId();
   const [amount, setAmount] = useState("5");
   const [open, setOpen] = useState(false);
   const [pending, setPending] = useState(false);
   const [error, setError] = useState("");

   useEffect(() => () => activeRequest.current?.abort(), []);
   const closeSupport = useCallback((restoreFocus = true) => {
      if (!dialog.current?.open) return;
      returnFocus.current = restoreFocus;
      dialog.current.close();
      setOpen(false);
      activeRequest.current?.abort();
      activeRequest.current = null;
      setPending(false);
      setError("");
   }, []);

   useEffect(() => {
      const media = window.matchMedia(desktopSupport);
      const dismiss = () => closeSupport();
      media.addEventListener("change", dismiss);
      return () => media.removeEventListener("change", dismiss);
   }, [closeSupport]);

   useClickOutside(support, () => {
      if (window.matchMedia(desktopSupport).matches) closeSupport(false);
   });

   function updateAmount(value: string) {
      setAmount(value);
      setError("");
   }

   function toggleSupport() {
      const panel = dialog.current;
      if (!panel) return;
      if (panel.open) {
         closeSupport();
         return;
      }
      returnFocus.current = true;
      if (window.matchMedia(desktopSupport).matches) panel.show();
      else panel.showModal();
      setOpen(true);
   }

   function handleClose() {
      if (!dialog.current?.open && returnFocus.current) trigger.current?.focus({ preventScroll: true });
   }

   async function startCheckout(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (activeRequest.current) return;
      const value = amount.trim().replace(",", ".");
      const price = /^\d*(\.\d{1,2})?$/.test(value) ? Number(value) : NaN;
      if (dollarsToCents(price) === null) {
         setError("Enter an amount of at least $0.50, with up to two decimal places.");
         return;
      }

      const request = new AbortController();
      activeRequest.current = request;
      setPending(true);
      setError("");
      try {
         const response = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: request.signal,
            body: JSON.stringify({
               success_url: supportThanksPath,
               metadata: { order_type: "tip" },
               lineItems: [{
                  price,
                  images: ["https://www.dayamuneton.com/DayaMunetonB&WArt.jpg"],
                  name: "Support My Work",
               }],
            }),
         });
         const data = await response.json();
         if (request.signal.aborted) return;
         if (!response.ok || typeof data.url !== "string") throw new Error("Checkout unavailable");
         if (data.url.startsWith("/") && !data.url.startsWith("//")) {
            if (await router.push(data.url)) closeSupport(false);
         } else {
            const checkout = new URL(data.url);
            if (checkout.protocol !== "https:") throw new Error("Invalid checkout URL");
            window.location.assign(checkout.href);
         }
      } catch {
         if (!request.signal.aborted) setError("Checkout is unavailable. Please try again.");
      } finally {
         if (activeRequest.current === request) {
            activeRequest.current = null;
            setPending(false);
         }
      }
   }

   return (
      <div ref={support} className="support-control"
         onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) &&
               window.matchMedia(desktopSupport).matches) closeSupport(false);
         }}
         onKeyDown={(event) => {
            if (event.key === "Escape" && open && window.matchMedia(desktopSupport).matches) {
               event.preventDefault();
               closeSupport();
            }
         }}>
         <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={dialogId}
            className="support-launch"
            onClick={toggleSupport}>
            Click here to support my work
            <FiChevronDown aria-hidden="true" />
         </button>
         <dialog ref={dialog} id={dialogId} aria-labelledby={titleId} className="support-dialog"
            onCancel={(event) => {
               event.preventDefault();
               closeSupport();
            }}
            onClose={handleClose} onClick={(event) => {
               if (event.target === event.currentTarget && !window.matchMedia(desktopSupport).matches) closeSupport();
            }}>
            <div className="support-dialog-body">
               <header className="mb-5 flex items-start justify-between gap-3">
                  <div>
                     <h2 id={titleId} className="text-2xl font-bold">Support my work</h2>
                     <p className="mt-1 text-sm text-muted">Your tip helps make emotional education freely available.</p>
                  </div>
                  <button type="button" className="support-close" aria-label="Close support"
                     onClick={() => closeSupport()}>
                     <span aria-hidden="true">×</span>
                  </button>
               </header>
               <form onSubmit={startCheckout} noValidate>
                  <fieldset disabled={pending}>
                     <legend className="mb-2 text-sm font-semibold">Choose an amount</legend>
                     <div className="support-options">
                        {tipOptions.map((tip) => (
                           <button type="button" key={tip} aria-pressed={Number(amount.replace(",", ".")) === tip}
                              onClick={() => updateAmount(String(tip))}>
                              ${tip}
                           </button>
                        ))}
                     </div>
                     <label className="mt-4 block text-sm font-semibold" htmlFor={amountId}>Tip amount (USD)</label>
                     <div className="support-input mt-2">
                        <span aria-hidden="true">$</span>
                        <input id={amountId} type="text" inputMode="decimal" autoComplete="off"
                           value={amount} onChange={(event) => updateAmount(event.target.value)}
                           aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
                     </div>
                     {error && <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger">{error}</p>}
                     <button type="submit" className="portfolio-button portfolio-button-primary mt-5 w-full">
                        {pending ? "Opening checkout…" : "Continue to checkout"}
                     </button>
                  </fieldset>
                  <span className="sr-only" role="status">{pending ? "Opening checkout…" : ""}</span>
               </form>
            </div>
         </dialog>
      </div>
   );
}
