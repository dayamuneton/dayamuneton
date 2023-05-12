import Navbar from "@/components/navbar";
import WithAuth from "@/components/withAuth";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/integrations/firebase/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import { replaceSpacesWithDashes } from "@/utils/replaceSpacesWithDashes";

function Admin() {
   const { logout } = useAuth();
   const [imageSrc, setImageSrc] = useState("");
   const [image, setImage] = useState<any>(null);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState(0);
   const [date, setDate] = useState(0);
   const [category, setCategory] = useState("heads");
   const [available, setAvailable] = useState("available");
   const [formatedFiles, setFormatedFiles] = useState<
      {
         dataURL: string | ArrayBuffer | null;
         name: string;
      }[]
   >([]);
   const [currentOpenFile, setCurrentOpenFile] = useState(0);

   const saveProduct = async (e: any) => {
      e.preventDefault();
      if (image === null) return;

      const photoRef = ref(storage, image.name);
      await uploadBytes(photoRef, image);

      let photoURL = await getDownloadURL(photoRef);

      await addDoc(collection(db, category), {
         photoURL: photoURL || 0,
         name: name.toLowerCase() || "",
         description: description || 0,
         price: price || 0,
         date: date || 0,
         available: available === "available" ? 1 : 0,
         category: category || "",
         handle: replaceSpacesWithDashes(name.toLowerCase()),
      });

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
               setFormatedFiles((prev) => [
                  ...prev,
                  {
                     dataURL: reader.result,
                     name: file.name,
                  },
               ]);
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

   const deleteImage = (fileToDelete: {
      dataURL: string | ArrayBuffer | null;
      name: string;
   }) => {
      const index = formatedFiles.findIndex(
         (file) => fileToDelete.name === file.name
      );
      if (index === currentOpenFile) {
         setCurrentOpenFile(Math.max(0, currentOpenFile - 1));
      }

      setFormatedFiles((prev) => {
         prev.splice(index, 1);
         return [...prev];
      });
   };

   const imageHandler = (e: any) => {
      setImageSrc("");
      setImage(null);
      const file = e.target.files[0];

      if (!file) return;
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
         if (reader.readyState === 2) {
            setImageSrc(reader.result as string);
         }
      };
      reader.readAsDataURL(e.target.files[0]);
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg">
         <Head>
            <title>Admin | Daya Muneton</title>
            <meta name="description" content="Daya Muneton" />
            <meta
               name="keywords"
               content="Arte, Ciencia, Tecnología, Amor, Liberate, Regalo"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Navbar />
         <LogoutIcon
            onClick={logout}
            className="absolute cursor-pointer right-2 top-2"
            sx={{ fontSize: "2rem" }}
         />
         <div className="flex flex-col items-center max-w-sm w-[90vw] overflow-hidden bg-white rounded drop-shadow-md mt-20 text-gray-500 mb-8">
            <div className="relative grid w-full aspect-square place-items-center">
               {formatedFiles.length !== 0 ? (
                  <>
                     <span className="relative w-full h-full aspect-square">
                        <Image
                           src={
                              formatedFiles[currentOpenFile]?.dataURL as string
                           }
                           alt=""
                           fill
                           className="object-cover"
                        />
                     </span>
                     <div className="flex w-full overflow-x-scroll">
                        {formatedFiles.map((file, key) => (
                           <div
                              key={file.dataURL as string}
                              className="relative"
                           >
                              <button
                                 className="absolute top-0 right-0"
                                 onClick={() => deleteImage(file)}
                              >
                                 <CloseIcon
                                    className="p-1 rounded-full hover:bg-gray-300 hover:text-red-500"
                                    sx={{
                                       fontSize: "1.7rem",
                                    }}
                                 />
                              </button>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                 src={file.dataURL as string}
                                 alt=""
                                 className="h-[4rem] mr-1 min-w-[4rem] aspect-square object-cover"
                                 onClick={() => setCurrentOpenFile(key)}
                              />
                           </div>
                        ))}
                        <label
                           htmlFor="inputImage"
                           className="aspect-square min-w-[4rem] bg-blue-400"
                        ></label>
                     </div>
                  </>
               ) : (
                  <>
                     <label
                        htmlFor="inputImage"
                        className="flex flex-col items-center justify-center w-full h-full  cursor-pointer hover:scale-[1.01]"
                     >
                        <AddPhotoAlternateIcon sx={{ fontSize: "3rem" }} />
                        <p>Upload Photo</p>
                     </label>
                  </>
               )}
            </div>
            <h2 className="w-full py-2 text-2xl font-medium text-center text-blue-400 border-t-2 border-t-gray-300">
               Add Item
            </h2>
            <form
               onSubmit={saveProduct}
               className="flex flex-col w-full px-6 pb-6"
            >
               <input
                  required
                  id="inputImage"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
               />
               <div className="flex flex-col w-full">
                  <label>
                     <p>Name:</p>
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-100"
                     />
                  </label>
                  <label>
                     <p>Description:</p>
                     <textarea
                        className="w-full bg-gray-100"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                     />
                  </label>
                  <label className="flex mt-4">
                     <p className="mr-4">Price:</p>
                     <p>$</p>
                     <input
                        type="number"
                        required
                        min={0}
                        value={price}
                        onChange={(e) =>
                           setPrice(parseFloat(e.target.value) || 0)
                        }
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
                        onChange={(e) =>
                           setDate(parseFloat(e.target.value) || 0)
                        }
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
                     <option value="heads">Heads</option>
                     <option value="bodies">Bodies</option>
                     <option value="abstracts">Abstracts</option>
                     <option value="memorials">Memorials</option>
                  </select>
                  <select
                     required
                     className="mb-4 border-b-2 border-gray-300"
                     autoComplete="on"
                     value={available}
                     onChange={(e) => setAvailable(e.target.value)}
                  >
                     <option value="available">Available</option>
                     <option value="soldout">Sold out</option>
                  </select>
               </div>
               <button
                  type="submit"
                  className="px-8 py-2 overflow-hidden text-white bg-blue-400 rounded w-fit"
               >
                  Submit
               </button>
            </form>
         </div>
      </div>
   );
}

function ProtectedPage() {
   return <WithAuth Component={Admin} />;
}

export default ProtectedPage;
