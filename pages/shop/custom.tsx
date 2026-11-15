import Head from "next/head";
import { site } from "@/config/site";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { sendWaMessageURL } from "@/utils/sendWaMessageURL";

const formats = [
   {
      title: "Digital Art Format",
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
      <div className="portfolio-content page-content commission-page">
         <Head><title>Custom Art Commissions | Daya Muneton</title><meta name="description" content="Commission digital art, an acrylic canvas, or a print from Daya Muneton." /></Head>
         <Link href="/shop" className="back-link">← Art shop</Link>
         <header className="commission-intro landing-copy">
            <h1>Custom Art Commissions</h1>
            <p>Hello, and thanks for your interest in my art!</p>
            <p>I&apos;m excited to discuss your commission request. If WhatsApp isn&apos;t accessible, you can email me at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
         </header>
         <div className="commission-formats">
            {formats.map(({ title, image, details, price, actions }) => (
               <details key={title} className="commission-format">
                  <summary>{title}<FiChevronDown aria-hidden="true" /></summary>
                  <div className="commission-details">
                     <div className="commission-image"><ArtworkImage src={image} alt="" fill sizes="(min-width: 440px) 160px, 33vw" className="object-cover" /></div>
                     <div className="reading-flow">
                        {details.map((line) => <p key={line}>{line}</p>)}
                        <p className="text-ink font-semibold">{price}</p>
                     </div>
                     <div className="detail-actions">
                        {actions.map(({ label, message }) => (
                           <a key={label} href={sendWaMessageURL(message)} className="portfolio-button portfolio-button-primary">{label}</a>
                        ))}
                     </div>
                  </div>
               </details>
            ))}
         </div>
      </div>
   );
}
