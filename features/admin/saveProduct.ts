import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "@/integrations/firebase/firestore-lite";
import { storage } from "@/integrations/firebase/storage";
import { replaceSpacesWithDashes } from "@/utils/replaceSpacesWithDashes";
import { catalogCollections, type CatalogKind } from "./catalogConfig";
import type { GuiaProductVariant } from "@/models/guiaProductModel";

export interface EditorImage {
   url: string;
   file?: File;
}

interface Draft {
   name: string;
   description: string;
   price: number;
   date: number;
   category: string;
   featuredImage: string;
   images: EditorImage[];
   shippingInformation: string;
   techniques: string[];
   available: boolean;
   beneficts: string;
   externalLink: string;
   externalLinkText: string;
   variants: GuiaProductVariant[];
}

export async function saveProduct(kind: CatalogKind, existing: { id: string; handle?: string } | null, draft: Draft) {
   const products = collection(db, catalogCollections[kind]);
   const handle = existing?.handle || replaceSpacesWithDashes(draft.name.toLowerCase());
   const matches = await getDocs(query(products, where("handle", "==", handle)));
   if (matches.docs.some((item) => item.id !== existing?.id)) throw new Error("Another product already uses that URL.");

   const uploaded: ReturnType<typeof ref>[] = [];
   const imageUrls = new Map<string, string>();
   try {
      for (const image of draft.images) {
         if (!image.file) continue;
         const photo = ref(storage, `catalog/${kind}/${crypto.randomUUID()}-${image.file.name}`);
         await uploadBytes(photo, image.file, { contentType: image.file.type });
         uploaded.push(photo);
         imageUrls.set(image.url, await getDownloadURL(photo));
      }
      const resolve = (url: string) => imageUrls.get(url) || url;
      const images = draft.images.map(({ url }) => resolve(url));
      const data = {
         handle,
         name: draft.name,
         description: draft.description,
         price: draft.price,
         date: draft.date,
         category: draft.category,
         images,
         featuredImage: resolve(draft.featuredImage) || images[0],
         ...(kind === "paintings" ? {
            techniques: draft.techniques,
            shippingInformation: draft.shippingInformation,
            status: draft.available ? 1 : 0,
            available: draft.available ? 1 : 0,
         } : {
            beneficts: draft.beneficts,
            externalLink: draft.externalLink,
            externalLinkText: draft.externalLinkText,
            variants: draft.variants.map((variant) => ({ ...variant, image: resolve(variant.image) })),
         }),
      };

      if (!existing) return { id: (await addDoc(products, data)).id, images, featuredImage: data.featuredImage, imageUrls };
      await updateDoc(doc(products, existing.id), data);
      return { id: existing.id, images, featuredImage: data.featuredImage, imageUrls };
   } catch {
      await Promise.allSettled(uploaded.map((photo) => deleteObject(photo)));
      throw new Error("Couldn’t save your changes. Please try again.");
   }
}
