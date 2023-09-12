import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class GuiaProduct {
   id: string;
   name: string;
   description: string;
   price: number;
   priceForMembers: number;
   images: string[];
   category: string;
   handle: string;
   variants: GuiaProductVariant[];
   mailerlite_group: string;
   beneficts: string;
   date: number;
   featuredImage: string;
   externalLink: string;
   externalLinkText: string;

   constructor({
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
      externalLink,
      externalLinkText,
   }: {
      id: string;
      name?: string;
      description?: string;
      price?: number;
      priceForMembers?: number;
      images?: string[];
      category?: string;
      handle?: string;
      variants?: GuiaProductVariant[];
      mailerlite_group?: string;
      beneficts?: string;
      date?: number;
      featuredImage?: string;
      externalLink?: string;
      externalLinkText?: string;
   }) {
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
      this.externalLink = externalLink || "";
      this.externalLinkText = externalLinkText || "";
   }
}

export class GuiaProductVariant {
   id: string;
   title: string;
   image: string;
   price: number;
   mailerlite_group: string;
   constructor({
      title,
      image,
      id,
      price,
      mailerlite_group,
   }: {
      id: string;
      title?: string;
      image?: string;
      price?: number;
      mailerlite_group?: string;
   }) {
      this.id = id || "";
      this.title = title || "";
      this.image = image || "";
      this.price = price || 0;
      this.mailerlite_group = mailerlite_group || "";
   }
}
export const productConverter = {
   toFirestore: (product: GuiaProduct) => {
      return product;
   },
   fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
   ) => {
      const data = snapshot.data(options) as GuiaProduct;
      const product = new GuiaProduct({
         ...data,
         variants: data.variants?.map(
            (variant) => new GuiaProductVariant(variant)
         ),
      });

      return product;
   },
};
