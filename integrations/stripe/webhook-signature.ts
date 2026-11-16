import Stripe from "stripe";

export function verifyStripeWebhook(body: Buffer, signature: string, secret: string) {
   return Stripe.webhooks.constructEvent(body, signature, secret);
}
