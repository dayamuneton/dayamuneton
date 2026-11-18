import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

let environment: RulesTestEnvironment;
before(async () => {
   environment = await initializeTestEnvironment({
      projectId: "demo-daya-security",
      firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") },
   });
   await environment.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await Promise.all([
         setDoc(doc(db, "admins", "admin@example.test"), { enabled: true }),
         setDoc(doc(db, "products", "art"), { name: "Artwork", price: 100 }),
         setDoc(doc(db, "shoppingCarts", "alice"), { customerEmail: "alice@example.test", isActive: true, isProcessed: false, cartItems: [], subTotal: 0 }),
         setDoc(doc(db, "orders", "alice"), { email: "alice@example.test", isProcessed: false }),
      ]);
   });
});
after(async () => { await environment?.cleanup(); });

test("visitors can read artwork while catalog, order, and admin writes require authorization", async () => {
   const guest = environment.unauthenticatedContext().firestore();
   await assertSucceeds(getDoc(doc(guest, "products", "art")));
   await assertFails(updateDoc(doc(guest, "products", "art"), { price: .5 }));
   await assertFails(setDoc(doc(guest, "admins", "attacker@example.test"), {}));
   await assertFails(getDoc(doc(guest, "orders", "alice")));
   await assertFails(setDoc(doc(guest, "orders", "forged"), { isProcessed: true }));
});

test("an account can read and update its own cart but cannot access another account", async () => {
   const alice = environment.authenticatedContext("alice", { email: "alice@example.test" }).firestore();
   const bob = environment.authenticatedContext("bob", { email: "bob@example.test" }).firestore();
   await assertSucceeds(getDocs(query(collection(alice, "shoppingCarts"), where("customerEmail", "==", "alice@example.test"))));
   await assertSucceeds(updateDoc(doc(alice, "shoppingCarts", "alice"), { cartItems: [], subTotal: 0 }));
   await assertFails(getDoc(doc(bob, "shoppingCarts", "alice")));
   await assertFails(updateDoc(doc(bob, "shoppingCarts", "alice"), { subTotal: 0 }));
   await assertFails(updateDoc(doc(alice, "shoppingCarts", "alice"), { customerEmail: "bob@example.test" }));
   await assertFails(updateDoc(doc(alice, "orders", "alice"), { isProcessed: true }));
   await assertFails(getDoc(doc(bob, "orders", "alice")));
});

test("only existing admins can edit the catalog, and role records cannot be created by clients", async () => {
   const admin = environment.authenticatedContext("admin", { email: "admin@example.test" }).firestore();
   const alice = environment.authenticatedContext("alice", { email: "alice@example.test" }).firestore();
   await assertSucceeds(getDoc(doc(admin, "admins", "admin@example.test")));
   await assertSucceeds(updateDoc(doc(admin, "products", "art"), { price: 125 }));
   await assertFails(updateDoc(doc(alice, "products", "art"), { price: .5 }));
   await assertFails(setDoc(doc(admin, "admins", "new@example.test"), {}));
   await assertFails(setDoc(doc(alice, "users", "alice@example.test"), { isMember: true }));
});
