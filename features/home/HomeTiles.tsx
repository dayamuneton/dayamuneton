import ArtworkTileGrid from "@/components/ui/ArtworkTileGrid";

const sections = [
   { href: "/community", image: "/StoriesBehindTheSongs.png", title: "Community", summary: "Stories behind the songs" },
   { href: "/shop", image: "/ShopMyArt.png", title: "Art shop", summary: "Original artwork and commissions" },
   { href: "/ageofemotions", image: "/MyNotes.png", title: "Emotional education", summary: "Guides and workshops" },
];

export default function HomeTiles() {
   return (
      <section aria-labelledby="explore-heading" className="portfolio-explore">
         <h2 id="explore-heading">Explore</h2>
         <ArtworkTileGrid items={sections} />
      </section>
   );
}
