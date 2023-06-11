import { GuiaProduct, GuiaProductVariant } from "@/models/guiaProductModel";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

function GuideVariants({
   product,
   setImage,
   setSelectedVariant,
   selectedVariant,
}: {
   product: GuiaProduct;
   setImage: React.Dispatch<React.SetStateAction<string>>;
   selectedVariant: GuiaProductVariant | undefined;
   setSelectedVariant: React.Dispatch<
      React.SetStateAction<GuiaProductVariant | undefined>
   >;
}) {
   const router = useRouter();

   useEffect(() => {
      const variant = router.query.variant as string;
      setSelectedVariant(product.variants?.find((v) => v.title === variant)!);
   }, [product.variants, router, setSelectedVariant]);

   const handleSetSelectedVariant = (variant: GuiaProductVariant) => {
      router.replace(
         {
            pathname: router.pathname,
            query: { ...router.query, variant: variant.title },
         },
         undefined,
         { shallow: true }
      );
      setSelectedVariant(variant);
      if (variant.image !== "") {
         setImage(variant.image || "");
      }
   };

   return (
      <div className="my-2">
         {product?.variants?.map((variant) => (
            <button
               onClick={() => {
                  handleSetSelectedVariant(variant);
               }}
               key={variant.id}
               className={`mr-2 capitalize bg-gray-100 hover:scale-[1.03] px-4 py-1 rounded-full ${
                  selectedVariant?.title === variant.title
                     ? "bg-gray-200 border-2 border-gray-400"
                     : ""
               }`}
            >
               {variant.title}
            </button>
         ))}
      </div>
   );
}

export default GuideVariants;
