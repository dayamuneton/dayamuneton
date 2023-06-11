import { useAdminProduct } from "@/context/adminGuidesContext";
import {
   GuiaProductVariant,
   GuiaProductVariantClass,
} from "@/models/guiaProductModel";
import { randomRange } from "@/utils/random";
import React, { useState } from "react";
import Variant from "./variant";

function Variants({ className }: { className: string }) {
   const { variants, setVariants } = useAdminProduct();
   const addVariant = () => {
      setVariants([
         new GuiaProductVariantClass({
            id: `${Math.floor(randomRange(1, 1000000))}`,
         }),
         ...variants,
      ]);
   };

   return (
      <div className={`${className}`}>
         <h2 className="text-xl font-medium">Variants</h2>

         <button
            onClick={addVariant}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 hover:scale-[1.01] cursor-pointer w-fit ml-auto mt-2"
         >
            Add Variant
         </button>
         <div className="flex flex-col items-center gap-4 ">
            {variants.map((variant) => (
               <Variant key={variant.id} variant={variant} />
            ))}
         </div>
      </div>
   );
}

export default Variants;
