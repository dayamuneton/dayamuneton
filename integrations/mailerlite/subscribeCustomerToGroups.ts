import { firstLetterUpperCaseEachWord } from "@/utils/firstLetterUpperCase";

export const subscribeCustomerToGroups = async (
   email: string,
   fullName: string,
   groups: string | string[]
) => {
   if (!email || !fullName) return;

   const name = fullName.toLowerCase();

   // console.log("log", "data for mailerlite", email, name);

   const splitName = firstLetterUpperCaseEachWord(name);

   const firstName = splitName[0];

   let lastName = "";

   if (splitName.length > 1) {
      lastName = splitName[splitName.length - 1];
   }

   let filteredGroups = typeof groups === "string" ? [groups] : groups;
   filteredGroups = filteredGroups.filter((group) => group !== undefined);

   const payload = {
      email: email,
      fields: {
         name: firstName,
         last_name: lastName,
      },
      groups: filteredGroups,
   };

   const data = JSON.stringify(payload);

   // const response =
   await fetch(process.env.NEXT_PUBLIC_MAILERLITE_SUBSCRIBERS_API_URL || "", {
      method: "POST",
      headers: {
         Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_MAILERLITE_API_KEY || ""
         }`,
         "Content-Type": "application/json",
         Accept: "application/json",
      },
      body: data,
   });

   // const mailerliteResponse = await response.json();

   // console.log("log", mailerliteResponse);
};
