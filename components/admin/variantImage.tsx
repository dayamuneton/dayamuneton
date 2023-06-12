import { useAdminProduct } from "@/context/adminGuidesContext";
import { GuiaProductVariant } from "@/models/guiaProductModel";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../ui/modal";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageUpload from "./imageUpload";

function VariantImage({ variant }: { variant: GuiaProductVariant }) {
   const { images, setVariants } = useAdminProduct();

   const [showModal, setShowModal] = useState(false);
   const openModal = () => setShowModal(true);
   const closeModal = () => setShowModal(false);

   const setVariantImage = (image: string) => {
      setVariants((prev) => {
         return prev.map((v) => {
            if (v.id === variant.id) {
               return new GuiaProductVariant({ ...v, image: image });
            }
            return v;
         });
      });
   };

   return (
      <>
         <Modal
            className="bg-white w-[90vw] max-w-3xl flex flex-col px-4"
            isOpen={showModal}
            onClose={closeModal}
         >
            <div className="flex justify-between py-3 border-b-2 border-gray-300">
               <p className="text-lg font-semibold">Update variant image</p>
               <CloseIcon
                  onClick={closeModal}
                  className="cursor-pointer hover:scale-[1.03]"
               />
            </div>
            <div className="flex flex-wrap gap-2 my-2">
               {images.map((image) => (
                  <button
                     onClick={() => setVariantImage(image)}
                     key={image}
                     className="relative aspect-square w-[5rem] flex hover:scale-[1.01] overflow-hidden rounded-lg"
                  >
                     <CheckCircleIcon
                        className={`${
                           variant.image === image
                              ? "text-green-500"
                              : "text-gray-300"
                        } rounded-full hover:text-green-500 absolute top-0 right-0 z-[50]`}
                        sx={{
                           fontSize: "1.3rem",
                        }}
                     />
                     <Image
                        src={image}
                        alt="product image"
                        fill
                        className="object-cover"
                     />
                  </button>
               ))}
            </div>
            <div className="flex items-center justify-end gap-2 py-4">
               <ImageUpload className="cursor-pointer px-2 py-1 border-2 border-gray-300 rounded-lg hover:scale-[1.03] ">
                  <p>Add Image</p>
               </ImageUpload>
               <button
                  onClick={closeModal}
                  className="px-2 py-1 text-white bg-green-700 border-2 border-green-800 rounded-lg hover:scale-[1.03] "
               >
                  Done
               </button>
            </div>
         </Modal>
         <div onClick={openModal} className="flex w-[4rem]">
            {variant.image ? (
               <span className="relative flex w-full aspect-square">
                  <Image
                     src={variant.image}
                     alt="variant image"
                     fill
                     className="object-cover"
                  />
               </span>
            ) : (
               <label className="grid place-items-center bg-gray-100 rounded-lg w-full aspect-square cursor-pointer text-gray-500 hover:scale-[1.03]">
                  <AddPhotoAlternateIcon />
               </label>
            )}
         </div>
      </>
   );
}

export default VariantImage;
