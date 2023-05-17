import Image from "next/image";
import Link from "next/link";
import React from "react";

function ProductRow({ product }: { product: any }) {
   if (!product) return null;
   return (
      <tr className="capitalize border-b-2 border-gray-300">
         <td className="pl-2">
            <span className="relative flex aspect-square h-[3rem] w-[3rem]">
               <Image src={product.featuredImage} alt={product.name} fill />
            </span>
         </td>
         <td className="py-2 pr-6 pl-2 max-w-[30ch] min-w-[10rem] flex items-center h-full">
            <Link
               href={`/admin/${product.id}`}
               className="w-full h-full my-auto"
            >
               {product.name}
            </Link>
         </td>
         <td className="py-2 pr-6 min-w-[10ch]"> {product.category} </td>
         <td className="py-2 pr-6"> {product.price} </td>
      </tr>
   );
}

function ProductsTable({ products }: { products: any }) {
   return (
      <div className="mb-auto max-w-[95vw] overflow-x-auto">
         <table>
            <thead>
               <tr className="bg-gray-100">
                  <th className="py-2 pl-2 pr-4 text-start"></th>
                  <th className="py-2 pl-2 pr-4 text-start">Name</th>
                  <th className="py-2 pr-4 text-start">Category</th>
                  <th className="py-2 pr-4 text-start">Price</th>
               </tr>
            </thead>
            <tbody>
               {products?.map((product: any) => (
                  <ProductRow key={product.id} product={product} />
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ProductsTable;
