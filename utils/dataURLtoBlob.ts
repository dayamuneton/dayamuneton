export const dataURLtoBlob = (dataurl: string): Blob | null => {
   const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/);

   if (!mime) {
      return null;
   }

   const binary = atob(arr[1]);
   const bytes = new Uint8Array(binary.length);
   for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
   }

   return new Blob([bytes], { type: mime[1] });
};
