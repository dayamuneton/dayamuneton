export const firstLetterUpperCaseEachWord = (words?: string) => {
   if (!words) return [""];
   let result = words.split(" ");

   for (let i = 0; i < result.length; i++) {
      result[i] = result[i].toLowerCase();
      result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
   }

   return result;
};
