export function capitalizeWords(text: string): string {
   const words = text.toLowerCase().split(" ");
   const capitalizedWords = [];

   for (const word of words) {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      capitalizedWords.push(capitalizedWord);
   }

   return capitalizedWords.join(" ");
}
