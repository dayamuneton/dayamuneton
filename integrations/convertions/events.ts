import { lowerCaseSha256HexHash } from "@/utils/sha256HexHash";
import { apiConvertions } from "./apiConvertions";

export const reportPageViewEvent = async (url: string) => {
   const reqPayload = {
      event_name: "PageView",
      event_source_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}${url}`,
   };
   return await apiConvertions(reqPayload);
};

export const reportPurchaseEvent = async (
   fullUrl: string,
   email: string,
   firstName: string,
   amountTotal: number
) => {
   const reqPayload = {
      event_name: "Purchase",
      event_source_url: `${fullUrl}`,
      user_data: {
         em: [lowerCaseSha256HexHash(email)],
         fn: [lowerCaseSha256HexHash(firstName)],
      },
      custom_data: {
         currency: "USD",
         value: amountTotal / 100 || 0,
      },
   };
   return await apiConvertions(reqPayload);
};

export const reportLeadEvent = async (
   url: string,
   email: string,
   firstName: string
) => {
   const reqPayload = {
      event_name: "Lead",
      event_source_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}${url}`,
      user_data: {
         em: [lowerCaseSha256HexHash(email)],
         fn: [lowerCaseSha256HexHash(firstName)],
      },
   };
   return await apiConvertions(reqPayload);
};

export const reportInitializeCheckoutEvent = async (
   url: string,
   email: string
) => {
   const reqPayload = {
      event_name: "InitiateCheckout",
      event_source_url: `${process.env.NEXT_PUBLIC_MY_DOMAIN}${url}`,
      user_data: {
         em: [lowerCaseSha256HexHash(email)],
      },
   };
   return await apiConvertions(reqPayload);
};
