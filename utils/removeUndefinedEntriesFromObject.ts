export const removeUndefinedEntriesFromObject = (obj: any) => {
   return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
   );
};
