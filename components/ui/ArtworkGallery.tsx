import ArtworkImage from "./ArtworkImage";

interface ArtworkGalleryProps {
   images?: string[];
   selected?: string;
   title: string;
   onSelect: (image: string) => void;
}

export default function ArtworkGallery({ images = [], selected, title, onSelect }: ArtworkGalleryProps) {
   const views = [...new Set(images.filter(Boolean))];
   return (
      <div className="product-gallery">
         <div className="product-gallery-main">
            <ArtworkImage src={selected} alt={title} fill priority
               sizes="(min-width: 1372px) 480px, (min-width: 768px) 35vw, (min-width: 565px) 480px, 85vw"
               className="object-contain" />
         </div>
         {views.length > 1 && (
            <div className="product-gallery-thumbs" role="group" aria-label="Artwork views">
               {views.map((image, index) => (
                  <button key={image} type="button" aria-label={`View image ${index + 1}`}
                     aria-pressed={selected === image} onClick={() => onSelect(image)}>
                     <ArtworkImage src={image} alt="" fill sizes="56px" className="object-cover" />
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
