import Image from "next/image";
import React from "react";

interface SquareImageHoverProps {
   src: string;
   alt: string;
   width: string;
   scale?: string;
}

function SquareImageHover({ src, alt, width, scale }: SquareImageHoverProps) {
   return (
      <div className={`relative ${width} aspect-square overflow-hidden  `}>
         <Image
            src={src}
            alt={alt}
            className={`object-cover ${scale} ease-in-out duration-300  `}
            fill
            priority
         />
      </div>
   );
}

export default SquareImageHover;
