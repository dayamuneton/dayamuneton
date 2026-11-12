import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { getApp } from "firebase/app";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getBytes, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, auth, db, storage } from "../../integrations/firebase/firebaseConfig";

test("homepage is readable without JavaScript or Firebase Auth", async ({ browser, baseURL }) => {
   const page = await browser.newPage({ javaScriptEnabled: false, baseURL });
   await page.goto("/");
   await expect(page.getByText("Welcome to my art gallery!")).toBeVisible();
   await expect(page.getByRole("link", { name: "Stories behind the songs Community" })).toHaveAttribute("href", "/community");
   await expect(page.getByRole("img", { name: "Shop My Art" })).toHaveAttribute("sizes", /27vw/);
   await page.close();
});

test("support accordion works with the keyboard and uses the local checkout", async ({ page }) => {
   const externalRequests: string[] = [];
   await page.route("**/*", async (route) => {
      const { hostname } = new URL(route.request().url());
      if (hostname !== "127.0.0.1") {
         externalRequests.push(hostname);
         await route.abort();
         return;
      }
      await route.continue();
   });
   await page.emulateMedia({ reducedMotion: "reduce" });
   await page.goto("/");
   await expect(page.getByRole("main")).toHaveCSS("color", "rgb(209, 213, 219)");
   await expect(page.getByRole("main")).toHaveCSS("background-image", /rgb\(74, 35, 169\).*rgb\(92, 221, 229\)/);
   const support = page.getByRole("button", { name: "Click here to support my work" });
   await expect(support).toHaveAttribute("aria-expanded", "false");
   await support.press("Enter");
   await expect(support).toHaveAttribute("aria-expanded", "true");
   await page.getByRole("spinbutton").fill("0");
   await page.getByRole("button", { name: "Send", exact: true }).click();
   await expect(page.getByRole("alert").filter({ hasText: "Enter an amount" })).toBeVisible();
   await page.getByRole("button", { name: "$10", exact: true }).click();
   await expect(page.getByRole("spinbutton")).toHaveValue("10");
   await page.getByRole("button", { name: "Send", exact: true }).click();
   await expect(page).toHaveURL(/\/thankyou\?checkout=local$/);
   expect(externalRequests).toEqual([]);
});

test("mobile navigation opens with the keyboard and returns focus on Escape", async ({ page, isMobile }) => {
   test.skip(!isMobile, "The desktop navigation stays open.");
   await page.goto("/");
   const menu = page.getByRole("button", { name: "Menu" });
   const navigation = page.getByRole("navigation", { name: "Main navigation" });
   await expect(navigation.getByRole("link", { name: "Shop", exact: true })).toBeHidden();
   await menu.press("Enter");
   await expect(navigation.getByRole("link", { name: "Shop", exact: true })).toBeVisible();
   await navigation.getByRole("link", { name: "Shop", exact: true }).press("Escape");
   await expect(menu).toBeFocused();
   await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("local APIs validate data and simulate payment and email", async ({ request }) => {
   const invalid = await request.post("/api/stripe/create-checkout-session", {
      data: { lineItems: [{ name: "Tip", price: 0 }] },
   });
   expect(invalid.status()).toBe(400);
   const valid = await request.post("/api/stripe/create-checkout-session", {
      data: { lineItems: [{ name: "Tip", price: 3 }], success_url: "https://example.test" },
   });
   expect(await valid.json()).toEqual({ url: "/thankyou?checkout=local" });
   expect((await request.post("/api/stripe/webhook")).status()).toBe(404);
   const mail = await request.post("/api/send-email", {
      data: { name: "Demo User", email: "demo@example.test", message: "Local fixture." },
   });
   expect(await mail.json()).toEqual({ accepted: true, local: true });
});

test("Auth, Firestore, and Storage work using only demo data", async ({ page }, testInfo) => {
   expect(getApp(app.name).options.projectId).toBe("demo-dayamuneton");
   expect(auth.emulatorConfig?.host).toBe("127.0.0.1");
   const email = `tester-${testInfo.project.name}-${Date.now()}@example.test`;
   const { user } = await createUserWithEmailAndPassword(auth, email, "local-password");
   expect(user.email).toBe(email);

   const artwork = doc(db, "products", `demo-${testInfo.project.name}`);
   const object = ref(storage, `smoke-tests/${user.uid}.jpg`);
   const image = await readFile("public/DayaMunetonB&WArt.jpg");
   await uploadBytes(object, image, { contentType: "image/jpeg" });
   const imageUrl = await getDownloadURL(object);
   expect(new URL(imageUrl).host).toBe("127.0.0.1:9199");
   expect((await getBytes(object)).byteLength).toBe(image.byteLength);
   await setDoc(artwork, {
      name: "Emulator Sample Artwork",
      category: "heads",
      handle: artwork.id,
      status: "available",
      available: 1,
      price: 125,
      images: [imageUrl],
   });
   expect((await getDoc(artwork)).data()?.price).toBe(125);
   await page.goto("/shop/heads");
   const art = page.locator(`a[href="/shop/heads/${artwork.id}"]`);
   await expect(art).toBeVisible();
   await expect.poll(() => art.locator("img").evaluate(
      (element) => element instanceof HTMLImageElement ? element.naturalWidth : 0,
   )).toBeGreaterThan(0);
   await deleteDoc(artwork);
   await deleteObject(object);
   await signOut(auth);
});
