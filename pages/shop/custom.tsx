import Head from "next/head";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { sendWaMessageURL } from "@/utils/sendWaMessageURL";

const formats = [
   {
      title: "Digital art",
      image: "/DigitalArtFormat.png",
      details: ["30 × 30 cm at 300 DPI", "Digital download in PNG format"],
      price: "$175 USD",
      actions: [{ label: "Request digital art", message: "Daya, I want a custom digital artwork." }],
   },
   {
      title: "Acrylic on canvas",
      image: "/AcrylicOnCanvas.png",
      details: ["Custom canvas sizes", "24 × 48, 30 × 40, 30 × 48, 36 × 36, 36 × 48, 48 × 48, and 48 × 60 inches"],
      price: "Price depends on size",
      actions: [{ label: "Request a canvas", message: "Daya, I want a custom artwork on canvas." }],
   },
   {
      title: "Art prints",
      image: "/ArtPrints.png",
      details: ["Canvas prints use dye-based inks. Giclée prints use archival pigment inks."],
      price: "Price depends on format",
      actions: [
         { label: "Request a reproduction", message: "Daya, I want a reproduction of your art." },
         { label: "Request a custom print", message: "Daya, I want a custom art print." },
      ],
   },
];

export default function Commissions() {
   return (
      <div className="portfolio-content page-content">
         <Head><title>Custom Art Commissions | Daya Muneton</title><meta name="description" content="Commission digital art, an acrylic canvas, or a print from Daya Muneton." /></Head>
         <Link href="/shop" className="back-link">← Art shop</Link>
         <PageIntro title="Custom art commissions" description="Choose a format and tell me what you have in mind. I’ll be happy to discuss your commission.">
            <a className="portfolio-button portfolio-button-secondary" href="mailto:info@dayamuneton.com">Email Daya</a>
         </PageIntro>
         <div className="catalog-grid">
            {formats.map(({ title, image, details, price, actions }) => (
               <section key={title} className="content-panel commission-card">
                  <div className="catalog-image"><ArtworkImage src={image} alt="" fill sizes="(min-width: 800px) 28vw, 90vw" className="object-cover" /></div>
                  <div className="reading-flow">
                     <h2>{title}</h2>
                     {details.map((line) => <p key={line}>{line}</p>)}
                     <p className="text-ink font-semibold">{price}</p>
                  </div>
                  <div className="detail-actions">
                     {actions.map(({ label, message }, index) => (
                        <a key={label} href={sendWaMessageURL(message)}
                           className={"portfolio-button " + (index === 0 ? "portfolio-button-primary" : "portfolio-button-secondary")}>{label}</a>
                     ))}
                  </div>
               </section>
            ))}
         </div>
      </div>
   );
}
