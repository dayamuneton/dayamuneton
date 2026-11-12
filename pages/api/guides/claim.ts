import type { NextApiRequest,NextApiResponse } from "next";
import { isPreviewSite } from "@/config/site-environment";
import { demoCatalog } from "@/features/catalog/demo-data";
import { subscribeCustomerToGroups } from "@/integrations/mailerlite/subscribeCustomerToGroups";
import type { GuiaProduct } from "@/models/guiaProductModel";

export default async function claimGuide(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).end();
   }
   const { email, name, items } = req.body ?? {};
   if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
       typeof name !== "string" || !name.trim() ||
       !Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ error: "Invalid guide claim" });
   }

   if (isPreviewSite) {
      const valid = items.every((item) => demoCatalog.pdfproducts.some((guide) => guide.price === 0 && guide.handle === item?.handle));
      return valid ? res.status(200).json({ accepted: true }) : res.status(400).end();
   }

   try {
      const { getProductByHandle } = await import("@/integrations/firebase/getProductByHandle");
      const groups: string[] = [];
      for (const item of items) {
         if (!item || typeof item.handle !== "string") return res.status(400).end();
         const snapshot = await getProductByHandle("pdfproducts", item.handle);
         const product = snapshot?.data() as GuiaProduct | undefined;
         if (!product || product.price !== 0) return res.status(400).end();
         const variants = product.variants || [];
         const variant = typeof item.variantId === "string" && item.variantId
            ? variants.find(({ id }) => id === item.variantId)
            : variants.find(({ mailerlite_group }) => mailerlite_group === item.group);
         if (variants.length && !variant) return res.status(400).end();
         groups.push(variant?.mailerlite_group ?? product.mailerlite_group);
      }
      await subscribeCustomerToGroups(email, name, groups);
      return res.status(200).json({ accepted: true });
   } catch {
      return res.status(502).json({ error: "Could not claim the guide. Try again." });
   }
}
