import Head from "next/head";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import ArtworkImage from "@/components/ui/ArtworkImage";
import PageIntro from "@/components/layout/PageIntro";
import { useAuth } from "@/context/authContext";

const prompts = [
   { title: "Feelings and flavors", image: "/HeadPhonesCommunity1.png", text: "What song makes you feel at home? Share the memory of love, friendship, or celebration that comes back when you hear it." },
   { title: "Dreams and challenges", image: "/HeadPhonesCommunity2.png", text: "Think of a song that gave you strength when you faced a challenge or pursued a dream. What did it mean to you then?" },
   { title: "Journeys and adventures", image: "/HeadPhonesCommunity3.png", text: "Which song takes you back to a trip or a spontaneous adventure? Share the story behind that memory." },
];

export default function Community() {
   const { currentUser } = useAuth();
   const storyTitle = useRef<HTMLHeadingElement>(null);
   const [loading, setLoading] = useState(false);
   const [status, setStatus] = useState<"sent" | "error">();

   function goToStory() {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      storyTitle.current?.scrollIntoView({ behavior });
      storyTitle.current?.focus({ preventScroll: true });
   }

   async function sendStory(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (loading) return;
      const form = event.currentTarget;
      const data = new FormData(form);
      setLoading(true);
      setStatus(undefined);
      try {
         const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: currentUser?.displayName || String(data.get("name") ?? "").trim(),
               email: currentUser?.email || String(data.get("email") ?? "").trim(),
               message: String(data.get("story") ?? "").trim(),
               anonymously: data.has("anonymously"),
            }),
         });
         if (!response.ok) throw new Error("Story could not be sent");
         form.reset();
         setStatus("sent");
      } catch {
         setStatus("error");
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="portfolio-content page-content">
         <Head><title>Community | Daya Muneton</title><meta name="description" content="Share the story behind a song that matters to you and contribute to A Latin Gift." /></Head>
         <PageIntro title="Stories behind the songs" description="Has a song ever told a story you hadn’t shared? Tell me about a song that matters to you and help shape A Latin Gift, a collective artwork about the music in our lives.">
            <button type="button" className="portfolio-button portfolio-button-primary" onClick={goToStory}>Share your story</button>
         </PageIntro>
         <section className="portfolio-explore" aria-labelledby="prompts-heading">
            <h2 id="prompts-heading">Find a place to start</h2>
            <div className="catalog-grid">
               {prompts.map(({ title, image, text }) => (
                  <article className="content-panel commission-card" key={title}>
                     <div className="catalog-image"><ArtworkImage src={image} alt="" fill sizes="(min-width: 800px) 28vw, 90vw" className="object-cover" /></div>
                     <div className="reading-flow"><h3>{title}</h3><p>{text}</p></div>
                  </article>
               ))}
            </div>
         </section>
         <div className="community-layout">
            <section className="content-panel reading-flow" aria-labelledby="activity-heading">
               <div className="catalog-image community-art">
                  <ArtworkImage src="/MujerYourCanvas1.png" alt="" fill sizes="(min-width: 1000px) 420px, 85vw" className="object-contain" />
               </div>
               <h2 id="activity-heading">About A Latin Gift</h2>
               <p>The project explores the role music plays in our lives. Your memories help shape the artwork and the stories that accompany it.</p>
               <Link href="/shop/memorials" className="form-link">Explore the collection</Link>
            </section>
            <section className="content-panel" aria-labelledby="story-heading">
               <h2 id="story-heading" ref={storyTitle} tabIndex={-1} className="section-title mb-3">Share your story</h2>
               <p className="text-muted mb-5">You can send your story anonymously. Daya may use your contribution in artwork, social media, books, or podcasts.</p>
               <form onSubmit={sendStory} className="form-stack">
                  {!currentUser?.email && <>
                     <label htmlFor="story-name">Name (optional)<input id="story-name" name="name" type="text" autoComplete="name" maxLength={120} /></label>
                     <label htmlFor="story-email">Email<input id="story-email" name="email" type="email" autoComplete="email" required /></label>
                  </>}
                  <label htmlFor="story-message">Your story<textarea id="story-message" name="story" rows={6} required maxLength={5000} /></label>
                  <label className="check-field"><input name="anonymously" type="checkbox" />Send anonymously</label>
                  <label className="check-field"><input type="checkbox" required /><span>I accept the <Link href="/legal/terms-of-service" target="_blank" className="form-link">terms and conditions</Link>.</span></label>
                  <button className="portfolio-button portfolio-button-primary" type="submit" disabled={loading}>{loading ? "Sending…" : "Submit my story"}</button>
                  {status === "sent" && <p role="status">Thank you. Your story was submitted.</p>}
                  {status === "error" && <p className="form-feedback" role="alert">Couldn’t send your story. Please try again.</p>}
               </form>
            </section>
         </div>
      </div>
   );
}
