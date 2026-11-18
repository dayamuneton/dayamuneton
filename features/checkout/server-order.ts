import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type Stripe from "stripe";
import { serverDb } from "@/integrations/firebase/admin";
import { isSoldOut } from "@/features/catalog/availability";
import { subscribeCustomerToGroups } from "@/integrations/mailerlite/subscribeCustomerToGroups";
import type { OrderItem } from "./catalog-items";
import { getStripe } from "@/integrations/stripe/stripeConfig";

export interface CustomerOrder {
   email: string;
   name: string;
   cartItems: OrderItem[];
   cartId?: string;
}

export async function releaseExpiredArtwork(items: OrderItem[]) {
   for (const item of items.filter((entry) => entry.catalog === "products")) {
      const snapshot = await serverDb().collection("products").doc(item.id).get();
      const reservedOrder: unknown = snapshot.get("reservedOrder");
      const reservedUntil: unknown = snapshot.get("reservedUntil");
      if (typeof reservedOrder !== "string" || !(reservedUntil instanceof Timestamp) || reservedUntil.toMillis() > Date.now()) continue;
      const order = await serverDb().collection("orders").doc(reservedOrder).get();
      const sessionId: unknown = order.get("stripeSessionId");
      if (typeof sessionId === "string") {
         let session = await getStripe().checkout.sessions.retrieve(sessionId);
         if (session.payment_status === "paid") throw new Error("This artwork was purchased.");
         if (session.status === "open") session = await getStripe().checkout.sessions.expire(sessionId);
         if (session.status !== "expired") throw new Error("This artwork is reserved.");
      }
      await releaseReservation(reservedOrder);
   }
}

export async function createServerOrder(order: CustomerOrder) {
   const db = serverDb();
   const reference = db.collection("orders").doc();
   const expiresAt = Math.floor(Date.now() / 1000) + 31 * 60;
   const artwork = order.cartItems.filter((item) => item.catalog === "products");
   await db.runTransaction(async (transaction) => {
      const snapshots = await Promise.all(artwork.map((item) => transaction.get(db.collection("products").doc(item.id))));
      for (const snapshot of snapshots) {
         const data = snapshot.data();
         if (!data || isSoldOut(data) || data.reservedOrder) {
            throw new Error("An artwork is already reserved or sold. Please refresh your cart.");
         }
      }
      transaction.create(reference, { ...order, isProcessed: false, totalCents: order.cartItems.reduce((sum, item) => sum + Math.round(item.price * 100), 0), createdAt: FieldValue.serverTimestamp() });
      for (const snapshot of snapshots) transaction.update(snapshot.ref, { reservedOrder: reference.id, reservedUntil: Timestamp.fromMillis(expiresAt * 1000) });
   });
   return { reference, expiresAt };
}

export async function releaseReservation(orderId: string) {
   const db = serverDb();
   await db.runTransaction(async (transaction) => {
      const orderRef = db.collection("orders").doc(orderId);
      const snapshot = await transaction.get(orderRef);
      if (!snapshot.exists || snapshot.get("isProcessed") === true || snapshot.get("status") === "paid") return;
      const items = (snapshot.get("cartItems") ?? []) as OrderItem[];
      const artwork = await Promise.all(items.filter((item) => item.catalog === "products")
         .map((item) => transaction.get(db.collection("products").doc(item.id))));
      for (const product of artwork) {
         if (product.get("reservedOrder") === orderId) transaction.update(product.ref, { reservedOrder: FieldValue.delete(), reservedUntil: FieldValue.delete() });
      }
      transaction.update(orderRef, { status: "expired" });
   });
}

export async function fulfillOrder(session: Stripe.Checkout.Session) {
   if (session.payment_status !== "paid" || !session.client_reference_id) return;
   const db = serverDb();
   const reference = db.collection("orders").doc(session.client_reference_id);
   const order = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists) throw new Error("Order not found.");
      if (snapshot.get("isProcessed") === true) return null;
      const data = snapshot.data() as CustomerOrder & { totalCents?: number; stripeSessionId?: string; processingUntil?: Timestamp };
      const expectedAmount = data.totalCents ?? data.cartItems.reduce((sum, item) => sum + Math.round(item.price * 100), 0);
      if ((data.stripeSessionId && data.stripeSessionId !== session.id) || session.currency !== "usd" ||
          session.amount_total !== expectedAmount || (session.customer_details?.email ?? session.customer_email)?.toLowerCase() !== data.email.toLowerCase()) {
         throw new Error("Payment does not match the order.");
      }
      if (data.processingUntil && data.processingUntil.toMillis() > Date.now()) throw new Error("Order processing is already running.");
      transaction.update(reference, { processingUntil: Timestamp.fromMillis(Date.now() + 120_000), status: "paid" });
      return data;
   });
   if (!order) return;
   try {
      await subscribeCustomerToGroups(order.email, order.name, order.cartItems.map((item) => item.mailerlite_group));
      await db.runTransaction(async (transaction) => {
         const artwork = await Promise.all(order.cartItems.filter((item) => item.catalog === "products")
            .map((item) => transaction.get(db.collection("products").doc(item.id))));
         const cartRef = order.cartId ? db.collection("shoppingCarts").doc(order.cartId) : null;
         const cart = cartRef ? await transaction.get(cartRef) : null;
         for (const product of artwork) {
            if (product.exists) transaction.update(product.ref, { status: 0, available: 0, reservedOrder: FieldValue.delete(), reservedUntil: FieldValue.delete() });
         }
         if (cart?.exists && cart.get("customerEmail") === order.email) {
            const current = (cart.get("cartItems") ?? []) as { id?: string; handle: string; variantId?: string; price: number }[];
            const remaining = current.filter((item) => !order.cartItems.some((purchased) =>
               (purchased.id === item.id || purchased.handle === item.handle) && purchased.variantId === (item.variantId ?? "")));
            transaction.update(cart.ref, { cartItems: remaining, subTotal: remaining.reduce((sum, item) => sum + item.price, 0) });
         }
         transaction.update(reference, { isProcessed: true, status: "fulfilled", processingUntil: FieldValue.delete(), fulfilledAt: FieldValue.serverTimestamp() });
      });
   } catch (error) {
      await reference.update({ processingUntil: FieldValue.delete() });
      throw error;
   }
}
