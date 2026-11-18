import assert from "node:assert/strict";
import { after, test } from "node:test";
import { deleteApp, getApps } from "firebase-admin/app";
import type Stripe from "stripe";
import { serverDb } from "../../integrations/firebase/admin";
import { createServerOrder, fulfillOrder, releaseReservation } from "../../features/checkout/server-order";
import type { OrderItem } from "../../features/checkout/catalog-items";

after(async () => { await Promise.all(getApps().map(deleteApp)); });

test("artwork reservation prevents concurrent checkout and expiry releases it", async () => {
   const product = serverDb().collection("products").doc("reserved-art-test");
   const item: OrderItem = { id: product.id, catalog: "products", handle: "art", category: "memorials", name: "Art", price: 100, variantId: "", mailerlite_group: "", featuredImage: "" };
   await product.set({ price: 100, status: 1 });
   const first = await createServerOrder({ email: "guest@example.test", name: "Guest", cartItems: [item] });
   try {
      await assert.rejects(createServerOrder({ email: "another@example.test", name: "Other", cartItems: [item] }));
      await releaseReservation(first.reference.id);
      assert.equal((await product.get()).get("reservedOrder"), undefined);
   } finally {
      await Promise.all([product.delete(), first.reference.delete()]);
   }
});

test("only a matching paid session fulfills an order, preserves newly added items, and tolerates retries", async () => {
   const product = serverDb().collection("products").doc("fulfilled-art-test");
   const cart = serverDb().collection("shoppingCarts").doc("fulfillment-cart-test");
   const item: OrderItem = { id: product.id, catalog: "products", handle: "art", category: "memorials", name: "Art", price: 100, variantId: "", mailerlite_group: "", featuredImage: "" };
   await product.set({ price: 100, status: 1 });
   await cart.set({ customerEmail: "guest@example.test", cartItems: [item, { handle: "later", name: "Later", price: 5 }], subTotal: 105 });
   const order = await createServerOrder({ email: "guest@example.test", name: "Guest", cartItems: [item], cartId: cart.id });
   const paid = { id: "cs_test_fulfillment", currency: "usd", payment_status: "paid", amount_total: 10000, customer_email: "guest@example.test", client_reference_id: order.reference.id } as Stripe.Checkout.Session;
   try {
      await fulfillOrder({ ...paid, payment_status: "unpaid" });
      assert.equal((await order.reference.get()).get("isProcessed"), false);
      await assert.rejects(fulfillOrder({ ...paid, amount_total: 50 }));
      await assert.rejects(fulfillOrder({ ...paid, customer_email: "other@example.test" }));
      await fulfillOrder(paid);
      await fulfillOrder(paid);
      assert.equal((await order.reference.get()).get("isProcessed"), true);
      assert.equal((await product.get()).get("status"), 0);
      assert.equal((await cart.get()).get("subTotal"), 5);
   } finally {
      await Promise.all([product.delete(), cart.delete(), order.reference.delete()]);
   }
});
