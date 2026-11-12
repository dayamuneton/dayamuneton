import Image from "next/image";

interface SquareImageHoverProps {
   src: string;
   alt: string;
   width: string;
   scale?: string;
   eager?: boolean;
}

function SquareImageHover({ src, alt, width, scale = "", eager = false }: SquareImageHoverProps) {
   return (
      <div className={`relative ${width} aspect-square overflow-hidden  `}>
         <Image
            src={src}
            alt={alt}
            className={`object-cover ${scale} ease-in-out duration-200 motion-reduce:transition-none motion-reduce:scale-none!`}
            fill
            sizes="(min-width: 1186px) 320px, (min-width: 640px) 27vw, (min-width: 400px) 320px, 80vw"
            loading={eager ? "eager" : "lazy"}
         />
      </div>
   );
}

export default SquareImageHover;
