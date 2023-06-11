import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import { db, storage } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { replaceSpacesWithDashes } from "@/utils/replaceSpacesWithDashes";
import { dataURLtoBlob } from "@/utils/dataURLtoBlob";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { capitalizeWords } from "@/utils/capitalizeWords";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { getProductByHandle } from "@/integrations/firebase/getProductByHandle";
import WithAuth from "@/components/withAuth";
import { formatDate } from "@/utils/formatDate";
import DeleteProduct from "@/components/admin/deleteProduct";
import UploadImages from "@/components/admin/uploadImages";
import { handleNumberInputChange } from "@/utils/validateNumberInput";
import {
   AdminProductProvider,
   useAdminProduct,
} from "@/context/adminGuidesContext";
import VariantImage from "@/components/admin/variantImage";
import {
   GuiaProduct,
   GuiaProductVariant,
   GuiaProductVariantClass,
} from "@/models/guiaProductModel";
import Variant from "@/components/admin/variant";
import {
   Acordion,
   AcordionButton,
   AcordionContent,
   AcordionIcon,
} from "@/components/ui/acordion";
import Variants from "@/components/admin/variants";

export async function getServerSideProps(context: any) {
   const { product } = context.query;
   if (product === "new") {
      return {
         props: {
            product: null,
         },
      };
   }
   const productDoc = await getDoc(doc(db, "pdfproducts", product));

   if (!productDoc.exists()) {
      return {
         redirect: {
            destination: "/admin/guides",
            permanent: true,
         },
      };
   }

   return {
      props: {
         product: { id: productDoc.id, ...productDoc.data() },
      },
   };
}

function Product({ product }: { product: GuiaProduct }) {
   const { images, setImages, featuredImage, setFeaturedImage, variants } =
      useAdminProduct();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState(product?.name || "");
   const [description, setDescription] = useState(product?.description || "");
   const [price, setPrice] = useState<number | string>(product?.price || 0);
   const [date, setDate] = useState<number | string>(
      product?.date || formatDate()
   );
   const [category, setCategory] = useState(product?.category || "freebies");

   const [beneficts, setBeneficts] = useState(product?.beneficts || "");

   const saveProduct = async (e: any) => {
      setLoading(true);
      e.preventDefault();

      const formatedName = name.trim().toLowerCase();
      // console.log(product);

      const productByHandle = await getProductByHandle(
         "pdfproducts",
         replaceSpacesWithDashes(formatedName)
      );
      if (product === null && productByHandle?.exists()) {
         setLoading(false);
         alert("Title already in use");
         return;
      } else if (
         product &&
         productByHandle &&
         product.id !== productByHandle?.id
      ) {
         setLoading(false);
         console.log(product, productByHandle);

         alert("Title already in use!");
         return;
      }

      if (images.length === 0) {
         setLoading(false);
         console.log("imagenes!");

         return;
      }

      let productID =
         product?.id || (await addDoc(collection(db, "pdfproducts"), {})).id;

      const formatedVariants =
         variants.map((v) => {
            if (v.title !== "" && v.mailerlite_group !== "") {
               return { ...v };
            }
         }) || [];

      const data = {
         name: capitalizeWords(formatedName) || "",
         description: description || 0,
         images: images || [],
         featuredImage: featuredImage || images[0],
         price: Number(price) || 0,
         date: Number(date) || 0,
         category: category || "",
         handle: replaceSpacesWithDashes(formatedName),
         beneficts: beneficts || "",
         variants: formatedVariants,
      };
      // console.log(product, data, variants);

      await updateDoc(doc(db, "pdfproducts", productID), data);

      if (product === null) {
         router.replace(`/admin/guides/${productID}`);
      }

      setFeaturedImage(featuredImage || images[0]);

      setLoading(false);
   };

   return (
      <div className="flex flex-col items-center min-h-screen overflow-hidden bg-[#ddf2f1]">
         <Head>
            <title>
               {product?.name
                  ? product.name + " | Editor | Daya  Muneton"
                  : "Add Product | Daya Muneton"}
            </title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <div className="flex flex-col w-[95vw] max-w-xl items-center justify-center h-full mt-12 mb-auto">
            <div className="flex flex-col w-full p-4 mb-4 bg-white rounded-xl">
               <div className="flex w-full">
                  <Link
                     href="/admin/guides"
                     className="px-4 py-2 mr-auto font-medium bg-gray-100 rounded-lg hover:scale-[1.01] "
                  >
                     <KeyboardBackspaceIcon />
                  </Link>
                  <DeleteProduct
                     productName={product?.name || ""}
                     productID={product?.id || ""}
                  />
                  <button
                     onClick={saveProduct}
                     className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 hover:scale-[1.01] cursor-pointer "
                     disabled={loading}
                  >
                     {loading ? <CgSpinner className="animate-spin" /> : "Save"}
                  </button>
               </div>
               <label>
                  <p className="text-lg font-medium">Name:</p>

                  <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="flex w-full px-2 py-1 capitalize bg-gray-100"
                  />
               </label>
               <label className="mt-4">
                  <p className="text-lg font-medium">Beneficts:</p>
                  <textarea
                     className="flex w-full px-2 py-1 bg-gray-100 min-h-[10rem] capitalize"
                     value={beneficts}
                     onChange={(e) => setBeneficts(e.target.value)}
                  />
               </label>
               <label className="mt-4">
                  <p className="text-lg font-medium">Description:</p>
                  <textarea
                     className="flex w-full px-2 py-1 bg-gray-100 min-h-[10rem] capitalize"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  />
               </label>
               <UploadImages product={product} />

               <label className="flex mt-4">
                  <p className="mr-4">Price:</p>
                  <p>$</p>
                  <input
                     type="number"
                     required
                     value={price}
                     onChange={(e) => handleNumberInputChange(e, setPrice)}
                     className="w-full bg-gray-100"
                  />
               </label>
               <label className="flex mt-4">
                  <p className="mr-4">Date:</p>

                  <input
                     type="number"
                     required
                     value={date}
                     onChange={(e) => handleNumberInputChange(e, setDate)}
                     className="w-full bg-gray-100"
                  />
               </label>

               <select
                  className="my-4 border-b-2 border-gray-300"
                  autoComplete="on"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
               >
                  <option value="freebies">Freebies</option>
                  <option value="colors">Colors</option>
                  <option value="chemistry">Chemistry</option>
               </select>
            </div>
            <Variants className="flex flex-col w-full p-4 mb-4 bg-white rounded-xl" />
         </div>

         <Footer />
      </div>
   );
}

function ProtectedPage(props: any) {
   return (
      <WithAuth
         Component={(props: any) => (
            <AdminProductProvider {...props}>
               <Product {...props} />
            </AdminProductProvider>
         )}
         props={props}
      />
   );
}

export default ProtectedPage;
