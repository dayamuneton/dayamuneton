import Image from "next/image";
import { memo, useState } from "react";
import variants from "@/lib/artwork/variants.json";

type Variant = (typeof variants)[keyof typeof variants];

interface ArtworkImageProps {
   src?: string | null;
   alt: string;
   sizes: string;
   fill?: boolean;
   eager?: boolean;
   priority?: boolean;
   className?: string;
}

function sourceSet(asset: Variant, format: string) {
   const widths = format === "webp" ? asset.widths : asset.fallbackWidths;
   return widths.map((width) => `${asset.path}-${width}.${format} ${width}w`).join(", ");
}

const artworkSources = new Map(Object.entries(variants).map(([src, asset]) => [
   src, { asset, webp: sourceSet(asset, "webp"), fallback: sourceSet(asset, asset.fallback) },
]));

const ArtworkImage = memo(function ArtworkImage({
   src, alt, sizes, fill = false, eager = false, priority = false, className = "",
}: ArtworkImageProps) {
   const [failedSrc, setFailedSrc] = useState<string>();
   const sources = src ? artworkSources.get(src) : undefined;
   const asset = sources?.asset;
   const imageClass = `${fill ? "artwork-fill" : "artwork-inline"} ${className}`;
   const loading = eager || priority ? "eager" : "lazy";

   if (!src || failedSrc === src) {
      return (
         <span className={`artwork-unavailable ${imageClass}`} role={alt ? "img" : undefined}
            style={!fill && asset ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined}
            aria-label={alt ? `${alt} (image unavailable)` : undefined} aria-hidden={!alt || undefined}>
            Image unavailable
         </span>
      );
   }

   if (!asset || !sources) {
      return (
         <Image src={src} alt={alt} fill={fill} sizes={sizes} loading={loading}
            width={fill ? undefined : 960} height={fill ? undefined : 960}
            fetchPriority={priority ? "high" : undefined} className={imageClass}
            onError={() => setFailedSrc(src)} />
      );
   }

   return (
      <picture>
         <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
         <img src={`${asset.path}-${asset.fallbackWidths[0]}.${asset.fallback}`}
            srcSet={sources.fallback} sizes={sizes} width={asset.width} height={asset.height}
            alt={alt} loading={loading} decoding="async" fetchPriority={priority ? "high" : undefined}
            className={imageClass} onError={() => setFailedSrc(src)} />
      </picture>
   );
});

export default ArtworkImage;
