import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useState, type FormEvent } from "react";
import ContinueWith from "@/components/continueWith";
import PageIntro from "@/components/layout/PageIntro";
import { useAuth } from "@/context/authContext";

function returnPath(input: string | string[] | undefined) {
   if (typeof input !== "string" || !input.startsWith("/") || input.startsWith("//") || /[\\\u0000-\u0020]/.test(input)) return "/";
   const url = new URL(input, "https://portfolio.invalid");
   return url.origin === "https://portfolio.invalid" && !url.pathname.startsWith("/auth/")
      ? url.pathname + url.search + url.hash
      : "/";
}

function PasswordField({ label, name, autoComplete, minLength, error }: {
   label: string;
   name: string;
   autoComplete: string;
   minLength?: number;
   error?: string;
}) {
   const [visible, setVisible] = useState(false);
   const id = useId();
   const message = error || (name === "password" && minLength ? `Use at least ${minLength} characters.` : undefined);
   return (
      <div className="grid gap-1.5">
         <label htmlFor={id}>{label}</label>
         <div className="password-field">
            <input id={id} name={name} type={visible ? "text" : "password"}
               required autoComplete={autoComplete} minLength={minLength} aria-invalid={error ? true : undefined}
               aria-describedby={message ? `${id}-hint` : undefined} />
            <button type="button" aria-controls={id}
               aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
               onClick={() => setVisible((value) => !value)}>
               {visible ? "Hide" : "Show"}
            </button>
         </div>
         {message && <p id={`${id}-hint`} className={error ? "field-hint text-danger" : "field-hint"} role={error ? "alert" : undefined}>{message}</p>}
      </div>
   );
}

export default function AccountForm({ mode }: { mode: "login" | "signup" }) {
   const router = useRouter();
   const { currentUser, signInWithEmail, signUpUserWithEmailAndPassword } = useAuth();
   const [error, setError] = useState("");
   const [confirmationError, setConfirmationError] = useState(false);
   const [pending, setPending] = useState(false);
   const signup = mode === "signup";
   const title = signup ? "Create an account" : "Sign in";
   const destination = returnPath(router.query.src);

   useEffect(() => {
      if (router.isReady && currentUser) void router.replace(destination);
   }, [currentUser, destination, router]);

   async function submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (pending) return;
      const fields = new FormData(event.currentTarget);
      const email = String(fields.get("email") ?? "").trim();
      const password = String(fields.get("password") ?? "");
      if (signup && password !== fields.get("confirmation")) {
         setError("");
         setConfirmationError(true);
         (event.currentTarget.elements.namedItem("confirmation") as HTMLInputElement | null)?.focus();
         return;
      }
      setPending(true);
      setError("");
      try {
         const failure = signup
            ? await signUpUserWithEmailAndPassword(email, password, String(fields.get("name") ?? "").trim())
            : await signInWithEmail(email, password);
         if (failure) {
            setError(signup
               ? "We couldn’t create your account. Check your email and password, or sign in if you already have an account."
               : "We couldn’t sign you in. Check your email and password and try again.");
         }
      } catch {
         setError("Something went wrong. Please try again.");
      } finally {
         setPending(false);
      }
   }

   return (
      <div className="portfolio-content page-content">
         <Head><title>{title} | Daya Muneton</title></Head>
         <section className="content-panel auth-panel">
            <PageIntro title={title} description={signup ? "Create an account to save artwork and guides in your cart." : "Sign in to access your account and cart."} />
            <form className="form-stack" onSubmit={submit} onChange={() => { if (confirmationError) setConfirmationError(false); }}>
               {signup && <label>Name<input name="name" autoComplete="name" required /></label>}
               <label>Email<input type="email" name="email" autoComplete="email" required /></label>
               <PasswordField label="Password" name="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 6 : undefined} />
               {signup && <PasswordField label="Confirm password" name="confirmation" autoComplete="new-password" minLength={6}
                  error={confirmationError ? "Passwords must match." : undefined} />}
               {error && <p className="form-feedback" role="alert">{error}</p>}
               <button className="portfolio-button portfolio-button-primary" disabled={pending} type="submit">
                  {pending ? "Please wait…" : title}
               </button>
            </form>
            <p className="mt-4 text-sm text-muted">
               {signup ? "Already have an account? " : "New here? "}
               <Link className="form-link" href={{ pathname: signup ? "/auth/login" : "/auth/signup", query: destination === "/" ? {} : { src: destination } }}>
                  {signup ? "Sign in" : "Create an account"}
               </Link>
            </p>
            <ContinueWith className="mt-5 border-t border-line pt-5" />
         </section>
      </div>
   );
}
