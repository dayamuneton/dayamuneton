export const sendWaMessageURL = (
   message: string,
   phoneNumber?: string | number
) => {
   if (!message) return "/";

   const encodedMessage = encodeURIComponent(message);

   const number = phoneNumber || process.env.NEXT_PUBLIC_DAYA_PHONE_NUMBER;

   return `https://wa.me/${number}?text=${encodedMessage}`;
};
