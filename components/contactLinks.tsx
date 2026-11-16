import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { site } from "@/config/site";

const socials = [
   { name: "Instagram", url: site.social.instagram, Icon: FaInstagram },
   { name: "Facebook", url: site.social.facebook, Icon: FaFacebook },
   { name: "TikTok", url: site.social.tiktok, Icon: FaTiktok },
];

export default function ContactLinks() {
   return (
      <ul className="social-links" aria-label="Social links">
         {socials.map(({ name, url, Icon }) => (
            <li key={name}>
               <a href={url} target="_blank" rel="noreferrer" aria-label={name}>
                  <Icon size={21} aria-hidden="true" />
               </a>
            </li>
         ))}
      </ul>
   );
}
