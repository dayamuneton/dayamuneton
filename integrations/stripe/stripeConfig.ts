import Stripe from "stripe";
import { isLocalSite } from "@/config/site-environment";

let client: Stripe | undefined;

export function getStripe() {
   if (isLocalSite) throw new Error("Stripe is disabled in the local site.");
   const key = process.env.STRIPE_SECRET_KEY;
   if (!key) throw new Error("STRIPE_SECRET_KEY is required.");
   return client ??= new Stripe(key);
}
