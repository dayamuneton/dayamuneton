import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const socials = [
   { name: "Instagram", url: "https://www.instagram.com/dayamuneton/", Icon: FaInstagram },
   { name: "Facebook", url: "https://www.facebook.com/dayamuneton", Icon: FaFacebook },
   { name: "TikTok", url: "https://www.tiktok.com/@dayamuneton", Icon: FaTiktok },
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
