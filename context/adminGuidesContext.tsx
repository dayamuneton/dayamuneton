import { storage } from "@/integrations/firebase/firebaseConfig";
import { GuiaProductVariant } from "@/models/guiaProductModel";
import { dataURLtoBlob } from "@/utils/dataURLtoBlob";
import { randomRange } from "@/utils/random";
import {
   deleteObject,
   getDownloadURL,
   ref,
   uploadBytes,
} from "firebase/storage";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminProductContextProps {
   setFeaturedImage: React.Dispatch<React.SetStateAction<string>>;
   featuredImage: string;
   images: string[];
   setImages: React.Dispatch<React.SetStateAction<string[]>>;
   variants: GuiaProductVariant[];
   setVariants: React.Dispatch<React.SetStateAction<GuiaProductVariant[]>>;
   handleImageUpload: (
      event: React.ChangeEvent<HTMLInputElement>
   ) => Promise<void>;
   deleteImage: (image: string) => void;
}

const AdminProductContext = createContext<AdminProductContextProps | null>(
   null
);

export function useAdminProduct() {
   return useContext(
      AdminProductContext as React.Context<AdminProductContextProps>
   );
}

export function AdminProductProvider({
   children,
   product,
}: {
   children: React.ReactNode;
   product: any;
}) {
   const [images, setImages] = useState<string[]>(product?.images || []);
   const [featuredImage, setFeaturedImage] = useState(
      product?.featuredImage || product?.images[0] || ""
   );

   const [variants, setVariants] = useState<GuiaProductVariant[]>(
      product?.variants || []
   );

   const uploadToStorage = async (
      readerResult: string | ArrayBuffer | null,
      fileName: string
   ) => {
      const photoRef = ref(
         storage,
         `${Math.floor(randomRange(0, 1000000))}${fileName}`
      );
      const blob = dataURLtoBlob(readerResult as string);
      if (!blob) {
         console.error("Invalid dataURL");
         return;
      }

      await uploadBytes(photoRef, blob);

      let photoURL = await getDownloadURL(photoRef);
      return photoURL;
   };

   const readFiles = async (files: File[]) => {
      for (const file of files) {
         const reader = new FileReader();
         reader.onload = async () => {
            if (reader.readyState === 2) {
               const uploadedImage = await uploadToStorage(
                  reader.result,
                  file.name
               );
               if (!uploadedImage) return;

               setImages((prev) => [...prev, uploadedImage]);
            }
         };
         reader.readAsDataURL(file);
      }
   };
   const handleImageUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      // console.log(event.target.files);

      if (!event.target.files) return;

      const files = Array.from(event.target.files);
      await readFiles(files);
      event.target.files = null;
      event.target.value = "";
   };

   const deleteImage = async (fileToDelete: string) => {
      const indexInImages = product?.images?.findIndex(
         (image: string) => fileToDelete === image
      );

      // If the image is not found in the local state, there's nothing to do.
      if (indexInImages === -1) {
         return;
      }

      try {
         const imageRef = ref(storage, fileToDelete);

         await deleteObject(imageRef);
      } catch (error) {
         console.error("Error deleting file from Firebase Storage.", error);
         return;
      }

      // If the image was successfully deleted from Firebase Storage, delete it from the local state.

      setImages((prev) => prev.filter((image) => image !== fileToDelete));

      setVariants((prev) =>
         prev.map((variant) => {
            if (variant.image === fileToDelete) {
               variant.image = "";
            }
            return variant;
         })
      );
   };

   const value = {
      images,
      setImages,
      featuredImage,
      setFeaturedImage,
      variants,
      setVariants,
      handleImageUpload,
      deleteImage,
   };

   return (
      <AdminProductContext.Provider value={value}>
         {children}
      </AdminProductContext.Provider>
   );
}
