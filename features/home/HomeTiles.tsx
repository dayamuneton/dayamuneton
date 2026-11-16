import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";

const sections = [
   { href: "/community", image: "/StoriesBehindTheSongs.png", title: "Community" },
   { href: "/shop", image: "/ShopMyArt.png", title: "Shop" },
   { href: "/ageofemotions", image: "/MyNotes.png", title: "Emotional Education" },
];

export default function HomeTiles() {
   return (
      <nav aria-label="Explore the portfolio">
         <ArtworkTileGrid items={sections} variant="home" />
      </nav>
   );
}
