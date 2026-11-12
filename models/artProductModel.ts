import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class ArtProduct {
   id: string;
   title: string;
   description: string;
   priceForMembers: number;
   images: string[];
   category: string;
   handle: string;
   price: number;

   constructor({
      id,
      title,
      description,
      images,
      category,
      handle,
      priceForMembers,
      price,
   }: {
      id: string;
      title: string;
      description: string;
      images: string[];
      category: string;
      handle: string;
      priceForMembers: number;
      price: number;
   }) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.images = images;
      this.category = category;
      this.handle = handle;
      this.priceForMembers = priceForMembers;
      this.price = price;
   }
}
export const productConverter = {
   toFirestore: (product: ArtProduct) => {
      return {
         id: product.id,
         title: product.title,
         description: product.description,
         images: product.images,
         category: product.category,
         handle: product.handle,
         priceForMembers: product.priceForMembers,
         price: product.price,
      };
   },
   fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
   ) => {
      const data = snapshot.data(options)!;
      const product = {
         id: snapshot.id,
         title: data.title,
         description: data.description,
         images: data.images,
         category: data.category,
         handle: data.handle,
         priceForMembers: data.priceForMembers,
         price: data.price,
      };
      return new ArtProduct(product);
   },
};
