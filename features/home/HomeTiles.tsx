import Link from "next/link";
import SquareImageHover from "@/components/SquareImageHover";

const sections = [
   { href: "/community", image: "/StoriesBehindTheSongs.png", alt: "Stories behind the songs", title: ["Community"], underline: true },
   { href: "/shop", image: "/ShopMyArt.png", alt: "Shop My Art", title: ["Shop"], underline: true },
   { href: "/ageofemotions", image: "/MyNotes.png", alt: "My Notes", title: ["Emotional", "Education"], underline: false },
];

export default function HomeTiles() {
   return (
      <div className="flex flex-col gap-3 mt-4 mb-20 sm:flex-row">
         {sections.map(({ href, image, alt, title, underline }, index) => (
            <Link key={href} href={href} className={`relative drop-shadow-lg group ${underline ? "hover:underline" : ""}`}>
               <SquareImageHover
                  src={image}
                  alt={alt}
                  width="w-[80vw] sm:w-[27vw] max-w-[20rem] rounded-[2rem] overflow-hidden"
                  scale="group-hover:scale-[1.05]"
                  eager={index === 0}
               />
               <span className="text-lg text-black whitespace-nowrap max-w-[25vw] font-bold uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer">
                  {title.map((line) => <span key={line} className="block">{line}</span>)}
               </span>
            </Link>
         ))}
      </div>
   );
}
