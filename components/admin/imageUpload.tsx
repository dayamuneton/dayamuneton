import { useAdminProduct } from "@/context/adminGuidesContext";
import React from "react";

function ImageUpload({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) {
   const { handleImageUpload } = useAdminProduct();
   return (
      <label className={className}>
         <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
         />
         {children}
      </label>
   );
}

export default ImageUpload;
