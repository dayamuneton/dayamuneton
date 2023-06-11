import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface GuiaProduct {
   id?: string;
   name?: string;
   description?: string;
   price?: number;
   priceForMembers?: number;
   images?: string[];
   category?: string;
   handle?: string;
   variants?: GuiaProductVariant[];
   mailerlite_group?: string;
   date?: number;
   beneficts?: string;
   featuredImage?: string;
}

export class GuiaProductClass implements GuiaProduct {
   id = "";
   name = "";
   description = "";
   price = 0;
   priceForMembers = 0;
   images: string[] = [];
   category = "";
   handle = "";
   variants: GuiaProductVariant[] = [];
   mailerlite_group = "";
   beneficts = "";
   date: number;
   featuredImage = "";

   constructor(
      {
         id,
         name,
         description,
         price,
         priceForMembers,
         images,
         category,
         handle,
         variants,
         mailerlite_group,
         beneficts,
         date,
         featuredImage,
      }: GuiaProduct = {} as GuiaProduct
   ) {
      this.id = id || "";
      this.name = name || "";
      this.description = description || "";
      this.price = price || 0;
      this.priceForMembers = priceForMembers || 0;
      this.images = images || [];
      this.category = category || "";
      this.handle = handle || "";
      this.variants = variants || [];
      this.mailerlite_group = mailerlite_group || "";
      this.beneficts = beneficts || "";
      this.date = date || 0;
      this.featuredImage = featuredImage || "";
   }
}

export interface GuiaProductVariant {
   title?: string;
   image?: string;
   id?: string;
   price?: number;
   mailerlite_group?: string;
}

export class GuiaProductVariantClass implements GuiaProductVariant {
   title = "";
   image = "";
   id = "";
   price = 0;
   mailerlite_group = "";
   constructor(
      {
         title,
         image,
         id,
         price,
         mailerlite_group,
      }: GuiaProductVariant = {} as GuiaProductVariant
   ) {
      this.id = id || "";
      this.title = title || "";
      this.image = image || "";
      this.price = price || 0;
      this.mailerlite_group = mailerlite_group || "";
   }
}
export const productConverter = {
   toFirestore: (product: GuiaProductClass) => {
      return product;
   },
   fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
   ) => {
      const data = snapshot.data(options) as GuiaProduct;
      const product = new GuiaProductClass({
         ...data,
         variants: data.variants?.map(
            (variant) => new GuiaProductVariantClass(variant)
         ),
      });

      return product;
   },
};
