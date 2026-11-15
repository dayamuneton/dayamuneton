import Link from "next/link";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { site } from "@/config/site";

export default function DayaProfile() {
   return (
      <Link href="/about" className="daya-profile" aria-label="About Daya Muneton">
         <span className="portfolio-portrait">
            <ArtworkImage src={site.portrait} alt="" fill sizes="112px" priority />
         </span>
         <span className="profile-handle">@DayaMuneton</span>
      </Link>
   );
}
