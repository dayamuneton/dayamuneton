import assert from "node:assert/strict";
import { test } from "node:test";
import Stripe from "stripe";
import { verifyStripeWebhook } from "../../integrations/stripe/webhook-signature";

const secret = "local-signature-test";
const payload = JSON.stringify({
   id: "evt_demo_checkout", object: "event", livemode: false,
   type: "checkout.session.completed",
   data: { object: { id: "cs_test_demo", payment_status: "paid" } },
});

test("Stripe's SDK accepts a signed test payload and rejects payload or key changes", () => {
   const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
   const event = verifyStripeWebhook(Buffer.from(payload), header, secret);
   assert.equal(event.type, "checkout.session.completed");
   assert.equal(event.livemode, false);
   assert.throws(() => verifyStripeWebhook(Buffer.from(payload.replace("paid", "unpaid")), header, secret));
   assert.throws(() => verifyStripeWebhook(Buffer.from(payload), header, "different-key"));
});

test("Stripe's SDK rejects an expired webhook signature", () => {
   const timestamp = Math.floor(Date.now() / 1000) - 3600;
   const header = Stripe.webhooks.generateTestHeaderString({ payload, secret, timestamp });
   assert.throws(() => verifyStripeWebhook(Buffer.from(payload), header, secret), /timestamp/i);
});
