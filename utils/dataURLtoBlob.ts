export const dataURLtoBlob = (dataurl: string): Blob | null => {
   let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/);

   if (!mime) {
      return null;
   }

   let bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
   while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
   }

   return new Blob([u8arr], { type: mime[1] });
};
