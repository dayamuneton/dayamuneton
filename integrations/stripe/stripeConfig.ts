import Stripe from "stripe";
import { isTestSite } from "@/config/site-environment";

let client: Stripe | undefined;

export function getStripe() {
   if (isTestSite) throw new Error("Stripe is disabled in the local site.");
   const key = process.env.STRIPE_SECRET_KEY;
   if (!key) throw new Error("STRIPE_SECRET_KEY is required.");
   return client ??= new Stripe(key);
}
