const paintings = [
   { category: "heads", name: "Head study", image: "/StoriesBehindTheSongs.png" },
   { category: "bodies", name: "Figure study", image: "/ShopMyArt.png" },
   { category: "abstracts", name: "Color study", image: "/MyNotes.png" },
   { category: "memorials", name: "Portrait study", image: "/newshopcelebrating.png" },
];
const guides = [
   { category: "freebies", name: "An introduction to art and emotions", image: "/Freebies.png", price: 0 },
   { category: "colors", name: "Explore emotions through color", image: "/ArtEmotions.png", price: 7 },
   { category: "chemistry", name: "How emotions work", image: "/ChemistryEmotions.png", price: 7 },
];

export const demoCatalog = {
   products: paintings.map(({ category, name, image }) => ({
      handle: "preview-" + category, category, name: "Demo · " + name, images: [image],
      price: 100, status: 1, available: 1, date: 20261112,
      description: "Sample listing for the portfolio preview.", techniques: [],
   })),
   pdfproducts: guides.map(({ category, name, image, price }) => ({
      handle: "preview-" + category, category, name: "Demo · " + name, images: [image],
      price, date: 20261112, description: "Sample guide for the portfolio preview.", variants: [],
   })),
};
