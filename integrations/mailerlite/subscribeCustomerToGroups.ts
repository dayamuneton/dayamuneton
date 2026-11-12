import { firstLetterUpperCaseEachWord } from "@/utils/firstLetterUpperCase";
import { isTestSite } from "@/config/site-environment";

export const subscribeCustomerToGroups = async (
   email: string,
   fullName: string,
   groups: string | string[]
) => {
   if (isTestSite || !email || !fullName) return;

   const name = fullName.toLowerCase();

   // console.log("log", "data for mailerlite", email, name);

   const splitName = firstLetterUpperCaseEachWord(name);

   const firstName = splitName[0];

   let lastName = "";

   if (splitName.length > 1) {
      lastName = splitName[splitName.length - 1];
   }

   const filteredGroups = [...new Set((typeof groups === "string" ? [groups] : groups)
      .filter((group) => typeof group === "string" && group.trim()))];
   if (!filteredGroups.length) return;

   const payload = {
      email: email,
      fields: {
         name: firstName,
         last_name: lastName,
      },
      groups: filteredGroups,
   };

   const data = JSON.stringify(payload);

   const apiKey = process.env.MAILERLITE_API_KEY;
   if (!apiKey) throw new Error("MAILERLITE_API_KEY is required.");
   const response = await fetch(process.env.MAILERLITE_SUBSCRIBERS_API_URL || "https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
         Authorization: `Bearer ${apiKey}`,
         "Content-Type": "application/json",
         Accept: "application/json",
      },
      body: data,
   });

   if (!response.ok) throw new Error(`MailerLite returned ${response.status}.`);
};
