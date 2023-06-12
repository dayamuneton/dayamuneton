import { GuiaProductVariant } from "@/models/guiaProductModel";
import React, { useState, useEffect } from "react";
import VariantImage from "./variantImage";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminProduct } from "@/context/adminGuidesContext";
import Modal from "../ui/modal";
import CloseIcon from "@mui/icons-material/Close";

function Variant({ variant }: { variant: GuiaProductVariant }) {
   const { setVariants } = useAdminProduct();
   const [title, setTitle] = useState(variant.title);
   const [mailerliteGroup, setMailerliteGroup] = useState(
      variant.mailerlite_group
   );
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   useEffect(() => {
      setVariants((prev) =>
         prev.map((v) => {
            if (v.id === variant.id) {
               return {
                  ...v,
                  title,
                  mailerlite_group: mailerliteGroup,
               };
            }
            return v;
         })
      );
   }, [title, mailerliteGroup, setVariants, variant.id]);
   const deleteVariant = () => {
      setVariants((prev) => prev.filter((v) => v.id !== variant.id));
   };
   const closeModal = () => setShowDeleteModal(false);

   return (
      <div className="relative flex flex-col items-center w-full gap-2 pb-2 border-b-2">
         <Modal isOpen={showDeleteModal} onClose={closeModal}>
            <div className="relative p-3 bg-white rounded-xl">
               <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Delete Variant</p>
                  <CloseIcon
                     onClick={closeModal}
                     className="p-1 rounded-full cursor-pointer top-1 right-1 hover:bg-gray-100"
                     sx={{ fontSize: "1.7rem" }}
                  />
               </div>
               <p>Are you sure to delete this variant?</p>
               <p className="py-2 my-2 font-medium border-gray-100 border-y-2">
                  {title}
               </p>
               <div className="flex justify-end gap-2 mt-4">
                  <button
                     onClick={closeModal}
                     className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={deleteVariant}
                     className="px-4 py-2 text-white bg-red-600 rounded-lg"
                  >
                     Delete
                  </button>
               </div>
            </div>
         </Modal>
         <DeleteIcon
            onClick={() => setShowDeleteModal(true)}
            className="absolute cursor-pointer top-2 right-2 hover:text-red-500"
         />
         <VariantImage variant={variant} />
         <label className="flex items-center w-full h-fit">
            <p className="mr-4 text-sm whitespace-nowrap">Title:</p>
            <input
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               type="text"
               className="flex w-full px-2 py-1 ml-2 capitalize bg-gray-100"
            />
         </label>
         <label className="flex items-center w-full h-fit">
            <p className="mr-4 text-sm whitespace-nowrap">Mailerlite Group:</p>
            <input
               value={mailerliteGroup}
               onChange={(e) => setMailerliteGroup(e.target.value)}
               type="text"
               className="flex w-full px-2 py-1 capitalize bg-gray-100"
            />
         </label>
      </div>
   );
}

export default Variant;
