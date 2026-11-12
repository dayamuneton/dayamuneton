import Image from "next/image";
import { useState } from "react";
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

export default function ArtworkImage({
   src, alt, sizes, fill = false, eager = false, priority = false, className = "",
}: ArtworkImageProps) {
   const [failedSrc, setFailedSrc] = useState<string>();
   const asset = src ? (variants as Record<string, Variant>)[src] : undefined;
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

   if (!asset) {
      return (
         <Image src={src} alt={alt} fill={fill} sizes={sizes} loading={loading}
            width={fill ? undefined : 960} height={fill ? undefined : 960}
            fetchPriority={priority ? "high" : undefined} className={imageClass}
            onError={() => setFailedSrc(src)} />
      );
   }

   return (
      <picture>
         <source type="image/webp" srcSet={sourceSet(asset, "webp")} sizes={sizes} />
         <img src={`${asset.path}-${asset.widths[0]}.${asset.fallback}`}
            srcSet={sourceSet(asset, asset.fallback)} sizes={sizes} width={asset.width} height={asset.height}
            alt={alt} loading={loading} decoding="async" fetchPriority={priority ? "high" : undefined}
            className={imageClass} onError={() => setFailedSrc(src)} />
      </picture>
   );
}
