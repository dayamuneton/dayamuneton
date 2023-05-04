import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok } from "react-icons/fa";

function ContactLinks({
   color,
   bgColor,
}: {
   color?: string;
   bgColor?: string;
}) {
   return (
      <div
         className="flex gap-2 p-1 mt-2"
         style={{
            color: color,
            backgroundColor: bgColor,
         }}
      >
         {/* <Link target="_blank" href="https://www.youtube.com/channel/UCcwzib11TVK-eQVbwgDfN5g/featuredj" className="grid place-items-center hover:scale-105">
            <YouTubeIcon
               sx={{
                  fontSize: "2.1rem",
               }}
            />
         </Link> */}
         <Link
            target="_blank"
            href="https://www.instagram.com/dayamuneton/"
            className="grid place-items-center hover:scale-105"
         >
            <InstagramIcon
               sx={{
                  fontSize: "2rem",
               }}
            />
         </Link>
         <Link
            target="_blank"
            href="https://www.facebook.com/dayamuneton"
            className="grid place-items-center hover:scale-105"
         >
            <FacebookIcon
               sx={{
                  fontSize: "2rem",
               }}
            />
         </Link>
         <Link
            target="_blank"
            href="https://www.tiktok.com/@dayamuneton"
            className="grid place-items-center hover:scale-105"
         >
            <FaTiktok
               style={{
                  fontSize: "1.5rem",
               }}
            />
         </Link>
      </div>
   );
}

export default ContactLinks;
