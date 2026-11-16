import Head from "next/head";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { useAuth } from "@/context/authContext";

const prompts = [
   {
      title: "Station of Feelings and Flavors: What emotions does your favorite song evoke?",
      image: "/HeadPhonesCommunity1.png",
      joined: "47+",
      text: "Share with us that story of love, friendship, or celebration that comes to mind every time you hear those chords. Is there a song that makes you feel at home, no matter where you are? This is where your anecdote takes the stage.",
   },
   {
      title: "Station of Dreams and Challenges",
      image: "/HeadPhonesCommunity2.png",
      joined: "39+",
      text: "Reflect on those moments when music gave you strength to face a challenge or accompanied you as you pursued a dream. Is there a tropical tune that symbolizes your resilience or the success you've achieved? Tell us how vibrant rhythms were the soundtrack to your personal struggle and victory.",
   },
   {
      title: "Station of Journeys and Adventures",
      image: "/HeadPhonesCommunity3.png",
      joined: "54+",
      text: "We all have that song that reminds us of a memorable trip or a spontaneous adventure. What rhythms take you back to those beach vacations or unexpected getaways with friends? Share the musical journey that led you to explore new horizons.",
   },
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
      <div className="portfolio-content community-page">
         <Head><title>Community | Daya Muneton</title><meta name="description" content="Share the story behind a song that matters to you and contribute to A Latin Gift." /></Head>
         <header className="community-intro">
            <p><mark>Today&apos;s topic:</mark></p>
            <h1>Be the voice of your song, share your story in &ldquo;A Latin Gift&rdquo;</h1>
            <p>Have you ever felt like a song was the story you never told? Our collective artwork, &ldquo;A Latin Gift&rdquo;, cannot be completed without your story. In your hands, you hold fragments of stories, pieces of memories that together form the cultural tapestry of our music. We invite you to share your story with your favorite song.</p>
         </header>
         <section aria-labelledby="prompts-heading">
            <h2 id="prompts-heading" className="community-prompts-heading">Some ideas that help you to write about your story</h2>
            <div className="community-prompts">
               {prompts.map(({ title, image, joined, text }) => (
                  <article className="community-prompt" key={title}>
                     <h3>{title}</h3>
                     <div className="community-artwork"><ArtworkImage src={image} alt="" fill sizes="(min-width: 800px) 15vw, 55vw" className="object-contain" /></div>
                     <p className="text-sm font-semibold">{joined} joined this</p>
                     <p>{text}</p>
                     <button type="button" className="portfolio-button portfolio-button-primary" onClick={goToStory}>Write my story</button>
                  </article>
               ))}
            </div>
         </section>
         <div className="community-layout">
            <section className="community-activity reading-flow" aria-labelledby="activity-heading">
               <h2 id="activity-heading">What is this activity about?</h2>
               <div className="community-activity-body">
                  <div className="community-artwork"><ArtworkImage src="/MujerYourCanvas1.png" alt="" fill sizes="(min-width: 760px) 240px, 65vw" className="object-contain" /></div>
                  <div className="reading-flow">
                     <p>By joining in, you&apos;re sharing your personal reflections and becoming part of a collective art masterpiece. This activity is crafted to uncover the cultural impact of music on your life.</p>
                     <p>Your participation enriches the creation of art and literature rooted in real-life stories. Thank you for contributing to this artwork.</p>
                     <Link href="/shop/memorials" className="form-link">Explore the collection</Link>
                  </div>
               </div>
            </section>
            <section className="content-panel story-panel" aria-labelledby="story-heading">
               <header className="reading-flow">
                  <h2 id="story-heading" ref={storyTitle} tabIndex={-1} className="section-title">Share your story</h2>
                  <p>You can share multiple stories, each about a different song. You can send your story anonymously. By accepting the terms, you grant Daya permission to use your contribution in artwork, social media, books, or podcasts.</p>
               </header>
               <form onSubmit={sendStory} className="form-stack">
                  {!currentUser?.email && <>
                     <label htmlFor="story-name">Name (optional)<input id="story-name" name="name" type="text" autoComplete="name" maxLength={120} /></label>
                     <label htmlFor="story-email">Email<input id="story-email" name="email" type="email" autoComplete="email" required /></label>
                  </>}
                  <label htmlFor="story-message">Your story<textarea id="story-message" name="story" rows={6} required maxLength={5000} /></label>
                  <label className="check-field"><input name="anonymously" type="checkbox" />Send anonymously</label>
                  <label className="check-field"><input type="checkbox" required /><span>I accept the <Link href="/legal/terms-of-service" target="_blank" className="form-link">terms and conditions</Link>.</span></label>
                  <button className="portfolio-button portfolio-button-primary" type="submit" disabled={loading}>{loading ? "Sending…" : "Submit my story"}</button>
                  {status === "error" && <p className="form-feedback" role="alert">Couldn’t send your story. Please try again.</p>}
                  {status === "sent" && <p role="status" className="success-feedback">Thank you. Your story was submitted.</p>}
               </form>
            </section>
         </div>
      </div>
   );
}
