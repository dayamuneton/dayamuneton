export const apiConvertions = async (reqPayload: any) => {
   if (process.env.NODE_ENV === "development") return {};

   const response = await fetch(
      `${process.env.NEXT_PUBLIC_MY_DOMAIN}/api/convertions`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            reqPayload,
         }),
      }
   );

   return await response.json();
};
