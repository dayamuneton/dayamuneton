import Stripe from "stripe";

let stripeKey: string | undefined = "";

if (process.env.NODE_ENV === "production") {
   stripeKey = process.env.STRIPE_SECRET_KEY;
} else {
   stripeKey = process.env.STRIPE_TEST_SECRET_KEY;
}

if (!stripeKey) {
   throw new Error("Stripe key is not defined.");
}

export const stripe = new Stripe(stripeKey, {
   apiVersion: "2022-11-15",
});
