import type { NextApiRequest, NextApiResponse } from "next";
import { site } from "@/config/site";
import { isTestSite } from "@/config/site-environment";
import { supportThanksPath } from "@/features/home/support";
import { getStripe } from "@/integrations/stripe/stripeConfig";
import { formatLineItems, sameOriginUrl } from "@/integrations/stripe/line-items";
import { parseSelections } from "@/features/checkout/catalog-items";
import { loadOrderItems } from "@/features/checkout/server-catalog";
import { createServerOrder, releaseExpiredArtwork, releaseReservation } from "@/features/checkout/server-order";
import { serverAuth, serverDb } from "@/integrations/firebase/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method not allowed" });
   }

   const { success_url, cancel_url, lineItems, metadata, email, name, cartId } = req.body ?? {};
   const tip = metadata?.order_type === "tip";

   if (isTestSite) {
      if (!formatLineItems(lineItems)) return res.status(400).json({ message: "Invalid checkout items" });
      const url = metadata?.order_type === "tip" && success_url === supportThanksPath
         ? supportThanksPath
         : "/thankyou?checkout=local";
      return res.status(200).json({ url });
   }

   try {
      const origin = new URL(process.env.NEXT_PUBLIC_MY_DOMAIN || site.origin).origin;
      if (tip) {
         const line_items = formatLineItems(lineItems);
         if (!line_items || line_items.length !== 1) return res.status(400).json({ message: "Invalid tip" });
         const session = await getStripe().checkout.sessions.create({
            mode: "payment", payment_method_types: ["card"],
            line_items: [{ ...line_items[0], price_data: { ...line_items[0].price_data!, product_data: { name: "Support My Work" } } }],
            success_url: new URL(supportThanksPath, origin).href,
            cancel_url: new URL("/", origin).href, metadata: { order_type: "tip" },
         });
         return res.status(200).json({ url: session.url });
      }
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          typeof name !== "string" || !name.trim() || name.length > 200) return res.status(400).json({ message: "Invalid customer" });
      const selections = parseSelections(lineItems);
      const items = await loadOrderItems(selections);
      if (items.some((item) => item.price <= 0)) return res.status(400).json({ message: "Claim free guides separately." });
      if (cartId !== undefined) {
         if (typeof cartId !== "string" || cartId.length > 250 || cartId.includes("/")) return res.status(400).end();
         const token = req.headers.authorization?.replace(/^Bearer /, "");
         if (!token) return res.status(401).end();
         const user = await serverAuth().verifyIdToken(token);
         const cart = await serverDb().collection("shoppingCarts").doc(cartId).get();
         if (user.email !== email || cart.get("customerEmail") !== user.email) return res.status(403).end();
      }
      await releaseExpiredArtwork(items);
      const order = await createServerOrder({ email, name: name.trim(), cartItems: items, ...(cartId && { cartId }) });
      let session;
      try {
         session = await getStripe().checkout.sessions.create({
            payment_method_types: ["card"], mode: "payment",
            line_items: formatLineItems(items)!,
            success_url: sameOriginUrl(success_url, origin, "/thankyou"), cancel_url: sameOriginUrl(cancel_url, origin, "/checkout"),
            customer_email: email, client_reference_id: order.reference.id,
            metadata: { order_type: "guias_pdf" }, expires_at: order.expiresAt,
         }, { idempotencyKey: order.reference.id });
         await order.reference.update({ stripeSessionId: session.id });
      } catch (error) {
         if (session?.id) await getStripe().checkout.sessions.expire(session.id);
         await releaseReservation(order.reference.id);
         throw error;
      }
      return res.status(200).json({ url: session.url });
   } catch {
      return res.status(502).json({ message: "Could not start checkout. Try again." });
   }
}
