import React, { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useAdminProduct } from "@/context/adminGuidesContext";
import ImageUpload from "./imageUpload";

function UploadImages() {
   const { images, setFeaturedImage, featuredImage, deleteImage } =
      useAdminProduct();

   return (
      <div>
         <p className="mt-4 text-lg font-medium">Images:</p>

         <div className="flex w-full overflow-x-auto overflow-y-hidden">
            <ImageUpload className="grid place-items-center bg-gray-100 rounded-lg min-w-[5rem] w-[5rem] aspect-square cursor-pointer text-gray-500 hover:scale-[1.03]">
               <AddPhotoAlternateIcon />
            </ImageUpload>

            {images?.map((image: any) => (
               <div
                  key={image}
                  className="relative cursor-pointer group hover:scale-[1.03]"
               >
                  <span
                     key={image}
                     className="flex relative w-[5rem] aspect-square overflow-hidden rounded-lg ml-2"
                  >
                     <Image
                        src={image}
                        alt={""}
                        fill
                        className="object-cover"
                     />
                  </span>
                  <button
                     className="absolute top-0 hidden right-1 group-hover:flex"
                     onClick={() => deleteImage(image)}
                  >
                     <CloseIcon
                        className="p-1 rounded-full hover:bg-gray-300 hover:text-red-500"
                        sx={{
                           fontSize: "1.7rem",
                        }}
                     />
                  </button>
                  <button className="absolute top-0 left-3 ">
                     <CheckCircleIcon
                        className={`${
                           featuredImage === image
                              ? "text-green-500"
                              : "text-gray-300"
                        } rounded-full hover:text-green-500`}
                        sx={{
                           fontSize: "1.3rem",
                        }}
                        onClick={() => {
                           setFeaturedImage(image);
                        }}
                     />
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
}

export default UploadImages;
