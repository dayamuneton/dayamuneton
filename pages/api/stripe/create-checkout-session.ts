import type { NextApiRequest, NextApiResponse } from "next";
import { isLocalSite } from "@/config/site-environment";
import { supportThanksPath } from "@/features/home/support";
import { getStripe } from "@/integrations/stripe/stripeConfig";
import { formatLineItems, sameOriginUrl } from "@/integrations/stripe/line-items";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method not allowed" });
   }

   const { success_url, cancel_url, lineItems, order_id, metadata, email } = req.body ?? {};
   const line_items = formatLineItems(lineItems);
   if (!line_items) return res.status(400).json({ message: "Invalid checkout items" });

   if (isLocalSite) {
      const url = metadata?.order_type === "tip" && success_url === supportThanksPath
         ? supportThanksPath
         : "/thankyou?checkout=local";
      return res.status(200).json({ url });
   }

   try {
      const origin = new URL(process.env.NEXT_PUBLIC_MY_DOMAIN || "https://www.dayamuneton.com").origin;
      const session = await getStripe().checkout.sessions.create({
         payment_method_types: ["card"],
         line_items,
         mode: "payment",
         success_url: sameOriginUrl(success_url, origin),
         cancel_url: sameOriginUrl(cancel_url, origin),
         customer_email: typeof email === "string" ? email : undefined,
         client_reference_id: typeof order_id === "string" ? order_id : undefined,
         metadata: {
            order_type: typeof metadata?.order_type === "string" ? metadata.order_type : "tip",
            customerName: typeof metadata?.customerName === "string" ? metadata.customerName.toLowerCase() : "",
            customerEmail: typeof metadata?.customerEmail === "string" ? metadata.customerEmail : "",
         },
         allow_promotion_codes: true,
      });

      return res.status(200).json({ url: session.url });
   } catch {
      return res.status(502).json({ message: "Could not start checkout. Try again." });
   }
}
