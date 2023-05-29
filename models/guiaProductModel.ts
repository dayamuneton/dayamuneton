import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class GuiaProduct {
   id: string;
   title: string;
   description: string;
   priceForMembers: number;
   images: string[];
   category: string;
   handle: string;
   mailerlite_group: string;
   buttonText: string;
   price: number;

   constructor({
      id,
      title,
      description,
      images,
      category,
      handle,
      mailerlite_group,
      priceForMembers,
      price,
      buttonText,
   }: {
      id: string;
      title: string;
      description: string;
      images: string[];
      category: string;
      handle: string;
      mailerlite_group: string;
      priceForMembers: number;
      price: number;
      buttonText: string;
   }) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.images = images;
      this.category = category;
      this.handle = handle;
      this.mailerlite_group = mailerlite_group;
      this.buttonText = buttonText;
      this.priceForMembers = priceForMembers;
      this.price = price;
   }
}
export const productConverter = {
   toFirestore: (product: GuiaProduct) => {
      return {
         id: product.id,
         title: product.title,
         description: product.description,
         images: product.images,
         category: product.category,
         handle: product.handle,
         mailerlite_group: product.mailerlite_group,
         priceForMembers: product.priceForMembers,
         price: product.price,
         buttonText: product.buttonText,
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
         mailerlite_group: data.mailerlite_group,
         priceForMembers: data.priceForMembers,
         price: data.price,
         buttonText: data.buttonText,
      };
      return new GuiaProduct(product);
   },
};
