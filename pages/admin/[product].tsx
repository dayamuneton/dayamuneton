import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { db, storage } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { replaceSpacesWithDashes } from "@/utils/replaceSpacesWithDashes";
import { dataURLtoBlob } from "@/utils/dataURLtoBlob";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";

export async function getServerSideProps(context: any) {
   const { product } = context.query;
   if (product === "addProduct") {
      return {
         props: {
            product: null,
         },
      };
   }
   const productDoc = await getDoc(doc(db, "products", product));

   if (!productDoc.exists()) {
      return {
         redirect: {
            destination: "/admin",
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

function Product(props: any) {
   const { product } = props;
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState(product?.name || "");
   const [description, setDescription] = useState(product?.description || "");
   const [price, setPrice] = useState(product?.price || 0);
   const [date, setDate] = useState(product?.date || 0);
   const [category, setCategory] = useState(product?.category || "heads");
   const [status, setStatus] = useState(product?.status || "available");
   const [formatedFiles, setFormatedFiles] = useState<
      {
         dataURL: string | ArrayBuffer | null;
         name: string;
      }[]
   >([]);
   const [images, setImages] = useState<string[]>(product?.images || []);
   const [featuredImage, setFeaturedImage] = useState(
      product?.featuredImage || ""
   );
   const [techniques, setTechnique] = useState<string[]>(
      product?.techniques || []
   );
   const techniquesOptions = ["Acrylic", "Abstraction", "Expressionism"];

   const saveProduct = async (e: any) => {
      setLoading(true);
      e.preventDefault();

      let dbImages = product?.images || [],
         featuredImageDB = featuredImage;

      for (const image of formatedFiles) {
         const photoRef = ref(storage, image.name);
         const blob = dataURLtoBlob(image.dataURL as string); //convert dataURL to Blob
         if (!blob) {
            console.error("Invalid dataURL");
            continue;
         }

         await uploadBytes(photoRef, blob);

         let photoURL = await getDownloadURL(photoRef);
         dbImages.push(photoURL);
         if (featuredImage === image.dataURL) {
            featuredImageDB = photoURL;
         }
      }
      const data = {
         name: name.toLowerCase() || "",
         description: description || 0,
         images: dbImages || [],
         featuredImage:
            featuredImageDB === "" ? dbImages[0] || "" : featuredImageDB,
         price: price || 0,
         date: date || 0,
         status: status === "available" ? 1 : 0,
         category: category || "",
         handle: replaceSpacesWithDashes(name.toLowerCase()),
         techniques: techniques || [],
      };

      if (product === null) {
         await addDoc(collection(db, "products"), data);
      } else {
         await updateDoc(doc(db, "products", product.id), data);
      }

      setLoading(false);
      // setFormatedFiles([]);
      // setImageSrc("");
      // setName("");
      // setDescription("");

      // setPrice(0);
      // setDate(0);
   };

   const readFiles = (files: File[]) => {
      for (const file of files) {
         const reader = new FileReader();
         reader.onload = () => {
            if (reader.readyState === 2) {
               let index = formatedFiles.findIndex(
                  (file) => file.dataURL === reader.result
               );
               if (index !== -1) return;
               setFormatedFiles((prev) => [
                  ...prev,
                  {
                     dataURL: reader.result,
                     name: file.name,
                  },
               ]);
               setImages((prev) => [...prev, reader.result as string]);
            }
         };
         reader.readAsDataURL(file);
      }
   };

   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const files = Array.from(event.target.files);
      readFiles(files);
   };

   const deleteImage = (fileToDelete: string) => {
      const index = formatedFiles.findIndex(
         (file) => fileToDelete === file.dataURL
      );
      console.log(index);

      const indexInImages = product?.images?.findIndex(
         (image: string) => fileToDelete === image
      );
      console.log(indexInImages);
      if (index !== -1) {
         formatedFiles.splice(index, 1);
      }
      const newFormatedFiles = formatedFiles;

      setFormatedFiles(newFormatedFiles);

      let newImages = newFormatedFiles.map((file) => file.dataURL as string);
      if (indexInImages !== -1) {
         product?.images?.splice(indexInImages, 1);
      }
      newImages = [...newImages, ...product?.images];
      setImages(newImages);
   };

   const handleTechniqueClick = (technique: string) => {
      if (techniques.includes(technique)) {
         removeTechnique(technique);
         return;
      }
      addTechnique(technique);
   };

   const addTechnique = (technique: string) => {
      setTechnique((prev) => [...prev, technique]);
   };
   const removeTechnique = (technique: string) => {
      const index = techniques.findIndex((tech) => tech === technique);
      if (index !== -1) {
         techniques.splice(index, 1);
      }
      setTechnique([...techniques]);
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
         <div className="flex flex-col items-center justify-center w-full h-full mt-12 mb-auto">
            <div className="bg-white w-[95vw] max-w-md mb-4 p-4 rounded-xl flex flex-col">
               <div className="flex ml-auto">
                  <Link
                     href="/admin"
                     className="px-4 py-2 mr-1 font-medium bg-gray-100 rounded-lg hover:bg-gray-100 hover:scale-[1.01] hover:text-red-600"
                  >
                     Cancel
                  </Link>
                  <button
                     onClick={saveProduct}
                     className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 hover:scale-[1.01] cursor-pointer "
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
                  <p className="text-lg font-medium">Description:</p>
                  <textarea
                     className="flex w-full px-2 py-1 bg-gray-100 min-h-[15rem] capitalize"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  />
               </label>
               <p className="mt-4 text-lg font-medium">Images:</p>
               <input
                  required
                  id="inputImage"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
               />
               <div className="flex w-full overflow-x-auto overflow-y-hidden">
                  <label
                     htmlFor="inputImage"
                     className="grid place-items-center bg-gray-100 rounded-lg min-w-[5rem] w-[5rem] aspect-square cursor-pointer text-gray-500 hover:scale-[1.03]"
                  >
                     <AddPhotoAlternateIcon />
                  </label>
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
                              alt={name}
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
               <label className="flex mt-4">
                  <p className="mr-4">Price:</p>
                  <p>$</p>
                  <input
                     type="number"
                     required
                     min={0}
                     value={price}
                     onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                     className="w-full bg-gray-100"
                  />
               </label>
               <label className="flex mt-4">
                  <p className="mr-4">Date:</p>

                  <input
                     type="number"
                     required
                     min={0}
                     value={date}
                     onChange={(e) => setDate(parseFloat(e.target.value) || 0)}
                     className="w-full bg-gray-100"
                  />
               </label>

               <div className="flex mt-4">
                  {techniquesOptions.map((technique: string) => (
                     <button
                        key={technique}
                        onClick={() => handleTechniqueClick(technique)}
                        className={`${
                           techniques.includes(technique)
                              ? "border-2 border-blue-700"
                              : ""
                        } px-4 py-2 mr-1 bg-gray-100 rounded-lg hover:bg-gray-200 `}
                     >
                        {technique}
                     </button>
                  ))}
               </div>

               <select
                  className="my-4 border-b-2 border-gray-300"
                  autoComplete="on"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
               >
                  <option value="heads">Heads</option>
                  <option value="bodies">Bodies</option>
                  <option value="abstracts">Abstracts</option>
                  <option value="memorials">Memorials</option>
               </select>
               <select
                  required
                  className="mb-4 border-b-2 border-gray-300"
                  autoComplete="on"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
               >
                  <option value="available">Available</option>
                  <option value="soldout">Sold out</option>
               </select>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Product;
