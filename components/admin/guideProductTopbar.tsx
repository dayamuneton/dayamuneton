import Link from "next/link";
import React from "react";
import DeleteProduct from "./deleteProduct";

function GuideProductTopbar() {
   return (
      <div className="flex w-full">
         {/* <Link
           href="/admin/guides"
           className="px-4 py-2 mr-auto font-medium bg-gray-100 rounded-lg hover:scale-[1.01] "
        >
           <KeyboardBackspaceIcon />
        </Link>
        <DeleteProduct productName={product?.name} productID={product?.id} />
        <button
           onClick={saveProduct}
           className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 hover:scale-[1.01] cursor-pointer "
           disabled={loading}
        >
           {loading ? <CgSpinner className="animate-spin" /> : "Save"}
        </button> */}
      </div>
   );
}

export default GuideProductTopbar;
