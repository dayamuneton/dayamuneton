import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/integrations/stripe/stripeConfig";
import { buffer } from "micro";
import checkoutSessionCompletedEvent from "@/handlers/checkoutSessionCompleted/event";

const signingSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

export const config = {
   api: {
      bodyParser: false,
   },
};

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
   }

   let event;

   const buf = await buffer(req);
   const sig = req.headers["stripe-signature"];

   try {
      if (!signingSecret || !sig) {
         res.status(400).send(
            "Webhook Error: signing secret or stripe-signature is missing"
         );

         return;
      }
      event = stripe.webhooks.constructEvent(buf, sig, signingSecret);
   } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
   }

   switch (event.type) {
      case "checkout.session.completed":
         await checkoutSessionCompletedEvent(event.data.object);
         break;

      default:
         break;
   }
   res.status(200).send("OK");
};

export default webhook;
