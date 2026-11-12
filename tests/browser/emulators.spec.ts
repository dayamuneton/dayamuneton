import { expect, test } from "@playwright/test";
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../integrations/firebase/firebaseConfig";
import { addItemToCart } from "../../integrations/firebase/shoppingCart/addItemToShoppingCart";
import { removeCartItem } from "../../integrations/firebase/shoppingCart/removeItemFromShoppingCart";
import { ShoppingCart } from "../../models/shoppingCartModel";

test("Auth rejects a bad password and Storage rejects unauthenticated writes", async ({}, testInfo) => {
   const email = `firebase-check-${testInfo.project.name}-${Date.now()}@example.test`;
   const password = "synthetic-emulator-password";
   await signOut(auth);
   const { user } = await createUserWithEmailAndPassword(auth, email, password);
   await signOut(auth);
   try {
      await expect(signInWithEmailAndPassword(auth, email, "incorrect-password"))
         .rejects.toMatchObject({ code: expect.stringMatching(/^auth\//) });
      await expect(uploadBytes(ref(storage, "checks/" + user.uid), new Uint8Array([1])))
         .rejects.toMatchObject({ code: "storage/unauthorized" });
   } finally {
      const { user: signedIn } = await signInWithEmailAndPassword(auth, email, password);
      await deleteUser(signedIn);
   }
});

test("concurrent cart writes keep one item and the correct total", async ({}, testInfo) => {
   const email = `firebase-cart-${testInfo.project.name}-${Date.now()}@example.test`;
   const { user } = await createUserWithEmailAndPassword(auth, email, "synthetic-emulator-password");
   const cartRef = doc(db, "shoppingCarts", "active:" + encodeURIComponent(email));
   const item = { name: "Demo item", handle: "demo-item", price: 9.25 };
   try {
      await Promise.all([addItemToCart(null, item, email), addItemToCart(null, item, email)]);
      const state = (await getDoc(cartRef)).data();
      expect(state?.cartItems).toEqual([item]);
      expect(state?.subTotal).toBe(9.25);

      const cart = new ShoppingCart({ ...state, id: cartRef.id } as ShoppingCart);
      await Promise.all([removeCartItem(cart, item), removeCartItem(cart, item)]);
      const updated = (await getDoc(cartRef)).data();
      expect(updated?.cartItems).toEqual([]);
      expect(updated?.subTotal).toBe(0);
   } finally {
      await deleteDoc(cartRef);
      await deleteUser(user);
   }
});
