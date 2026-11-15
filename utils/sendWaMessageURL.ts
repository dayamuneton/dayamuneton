import { site } from "@/config/site";

export function sendWaMessageURL(message: string, phoneNumber?: string | number) {
   const phone = String(phoneNumber || process.env.NEXT_PUBLIC_DAYA_PHONE_NUMBER || "").replace(/[^0-9]/g, "");
   const text = encodeURIComponent(message);
   return phone ? `https://wa.me/${phone}?text=${text}` : `mailto:${site.email}?body=${text}`;
}
