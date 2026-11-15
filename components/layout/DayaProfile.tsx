import Link from "next/link";
import ArtworkImage from "@/components/ui/ArtworkImage";

export default function DayaProfile() {
   return (
      <Link href="/about" className="daya-profile" aria-label="About Daya Muneton">
         <span className="portfolio-portrait">
            <ArtworkImage src="/DayaMunetonB&WArt.jpg" alt="" fill sizes="112px" priority />
         </span>
         <span>@DayaMuneton</span>
      </Link>
   );
}
