import type { NextApiRequest, NextApiResponse } from "next";
import { isTestSite } from "@/config/site-environment";
import checkoutSessionCompletedEvent from "@/handlers/checkoutSessionCompleted/event";
import { getStripe } from "@/integrations/stripe/stripeConfig";

export const config = { api: { bodyParser: false } };

async function readBody(request: NextApiRequest) {
   const chunks: Buffer[] = [];
   let bytes = 0;
   for await (const chunk of request) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buffer.length;
      if (bytes > 1024 * 1024) throw new Error("Webhook payload too large");
      chunks.push(buffer);
   }
   return Buffer.concat(chunks, bytes);
}

export default async function webhook(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).end();
   }
   if (isTestSite) return res.status(404).end();

   const secret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
   const signature = req.headers["stripe-signature"];
   if (!secret || typeof signature !== "string") return res.status(400).end();

   let event;
   try {
      event = getStripe().webhooks.constructEvent(await readBody(req), signature, secret);
   } catch {
      return res.status(400).send("Invalid webhook");
   }

   try {
      if (event.type === "checkout.session.completed") {
         await checkoutSessionCompletedEvent(event.data.object);
      }
      return res.status(200).send("OK");
   } catch {
      return res.status(500).send("Could not process webhook");
   }
}
