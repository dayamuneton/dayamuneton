import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import Modal from "../ui/modal";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/integrations/firebase/firebaseConfig";

function DeleteProduct({
   productName,
   productID,
}: {
   productName: string;
   productID: string;
}) {
   const router = useRouter();
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const closeModal = () => setShowDeleteModal(false);
   const deleteProduct = async () => {
      await deleteDoc(doc(db, "pdfproducts", productID));
      router.back();
   };

   return (
      <div>
         <Modal isOpen={showDeleteModal} onClose={closeModal}>
            <div className="relative p-3 bg-white rounded-xl">
               <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Delete Product</p>
                  <CloseIcon
                     onClick={closeModal}
                     className="p-1 rounded-full cursor-pointer top-1 right-1 hover:bg-gray-100"
                     sx={{ fontSize: "1.7rem" }}
                  />
               </div>
               <p>Are you sure to delete this product?</p>
               <p className="py-2 my-2 font-medium border-gray-100 border-y-2">
                  {productName}
               </p>
               <div className="flex justify-end gap-2 mt-4">
                  <button
                     onClick={closeModal}
                     className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={deleteProduct}
                     className="px-4 py-2 text-white bg-red-600 rounded-lg"
                  >
                     Delete
                  </button>
               </div>
            </div>
         </Modal>
         <button
            onClick={() => setShowDeleteModal(true)}
            className={`px-4 py-2 mr-1 bg-gray-100 rounded-lg hover:text-red-600 hover:scale-[1.03] ${
               router.query.product === "new" && "hidden"
            }`}
         >
            <DeleteIcon />
         </button>
      </div>
   );
}

export default DeleteProduct;
