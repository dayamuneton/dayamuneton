import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { getApp } from "firebase/app";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getBytes, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, auth, db, storage } from "../../integrations/firebase/firebaseConfig";

test("homepage is readable without JavaScript or Firebase Auth", async ({ browser, baseURL }) => {
   const page = await browser.newPage({ javaScriptEnabled: false, baseURL, viewport: { width: 1440, height: 1080 } });
   await page.goto("/");
   await expect(page.getByRole("heading", { name: "Welcome to my art gallery!", level: 1 })).toBeVisible();
   const tiles = page.getByRole("navigation", { name: "Explore the portfolio" });
   await expect(tiles.getByRole("link")).toHaveText(["Community", "Shop", "Emotional Education"]);
   await expect(tiles.getByRole("link", { name: "Community" })).toHaveAttribute("href", "/community");
   await expect(page.locator("html")).toHaveCSS("scrollbar-gutter", "auto");
   await expect(page.locator(".site-shell")).toHaveCSS("background-image", /^radial-gradient/);
   expect(await page.locator(".site-shell").evaluate((shell) => Math.round(window.innerWidth - shell.getBoundingClientRect().right))).toBe(0);
   const portrait = page.locator(".portfolio-portrait img");
   await expect(portrait).toHaveAttribute("fetchpriority", "high");
   await expect(portrait).toHaveAttribute("sizes", "112px");
   await expect(tiles.locator("img[loading=lazy]")).toHaveCount(3);
   await expect.poll(() => portrait.evaluate((element) => (
      element instanceof HTMLImageElement ? new URL(element.currentSrc).pathname : ""
   ))).toMatch(/^\/artwork\/.+\.(webp|jpg)$/);
   await page.close();
});

test("support opens as a desktop dropdown or mobile modal without shifting the page", async ({ page, isMobile }) => {
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
   if (isMobile) await page.emulateMedia({ reducedMotion: "reduce" });
   await page.goto("/");
   const support = page.getByRole("button", { name: "Click here to support my work" });
   const explore = page.getByRole("navigation", { name: "Explore the portfolio" });
   const before = await explore.boundingBox();
   await support.press("Enter");
   const dialog = page.getByRole("dialog", { name: "Support my work" });
   await expect(dialog).toBeVisible();
   await expect(dialog).toHaveCSS("background-image", /^linear-gradient/);
   await expect(support).toHaveAttribute("aria-expanded", "true");
   expect(await dialog.evaluate((panel) => panel.matches(":modal"))).toBe(isMobile);
   if (!isMobile) {
      const triggerBox = (await support.boundingBox())!;
      const dropdownBox = (await dialog.boundingBox())!;
      expect(dropdownBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height);
      expect(dropdownBox.x).toBeCloseTo(triggerBox.x, 0);
      await page.getByRole("heading", { name: "Welcome to my art gallery!" }).click();
      await expect(dialog).toBeHidden();
      await support.press("Enter");
   }
   const after = await explore.boundingBox();
   expect(after?.x).toBeCloseTo(before?.x ?? 0, 0);
   expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
   await dialog.getByRole("button", { name: "Close support" }).press("Escape");
   await expect(dialog).toBeHidden();
   await expect(support).toBeFocused();
   await support.press("Enter");
   const amount = dialog.getByRole("textbox", { name: "Tip amount (USD)" });
   await expect(amount).toHaveCSS("color", "rgb(255, 255, 255)");
   await amount.fill("0");
   await dialog.getByRole("button", { name: "Continue to checkout" }).click();
   await expect(dialog.getByRole("alert")).toContainText("Enter an amount");
   await dialog.getByRole("button", { name: "$10", exact: true }).click();
   await expect(amount).toHaveValue("10");
   await amount.fill("5,50");
   await amount.press("Enter");
   await expect(page).toHaveURL(/\/support\/thanks$/);
   await expect(page.getByRole("heading", { name: "Thank you for your support" })).toBeVisible();
   expect(externalRequests).toEqual([]);
});

test("a slow collection navigation shows feedback and delivers a responsive banner", async ({ page }) => {
   await page.route(/\/_next\/data\/.*\/shop\/heads\.json/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 550));
      await route.continue();
   });
   await page.goto("/shop");
   await page.getByRole("link", { name: /Forgotten Bodies/ }).click();
   await expect(page.getByText("Loading page…", { exact: true })).toBeVisible();
   await expect(page.getByRole("heading", { name: "Heads", exact: true })).toBeVisible();
   await expect(page.getByText("Loading page…", { exact: true })).toBeHidden();
   await expect(page.getByRole("main")).toBeFocused();
   const banner = page.locator(".gallery-banner img");
   await expect.poll(() => banner.evaluate((element) => (
      element instanceof HTMLImageElement && element.complete ? element.naturalWidth : 0
   ))).toBeGreaterThan(0);
   const source = await banner.evaluate((element) => (element as HTMLImageElement).currentSrc);
   expect(new URL(source).pathname).toMatch(/^\/artwork\/bannerheads-/);
   const response = await page.request.get(source);
   expect((await response.body()).byteLength).toBeLessThan(450_000);
});

test("password mismatch points to the confirmation without clearing either field", async ({ page }) => {
   await page.goto("/auth/signup");
   await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
   await page.getByLabel("Email", { exact: true }).fill("signup@example.test");
   await page.getByLabel("Password", { exact: true }).fill("demo-password");
   const confirm = page.getByLabel("Confirm password", { exact: true });
   await confirm.fill("different-password");
   await page.getByRole("button", { name: "Create an account" }).click();
   await expect(confirm).toBeFocused();
   await expect(confirm).toHaveAccessibleDescription("Passwords must match.");
   await expect(confirm).toHaveValue("different-password");
   await expect(page.getByLabel("Password", { exact: true })).toHaveValue("demo-password");
});

test("story form keeps the draft after a failure and confirms a successful retry", async ({ page }) => {
   await page.route("**/api/send-email", (route) => route.fulfill({ status: 503, json: { error: "Unavailable" } }), { times: 1 });
   await page.goto("/community");
   await page.getByRole("button", { name: "Write my story" }).first().click();
   await expect(page.getByRole("heading", { name: "Share your story", exact: true })).toBeFocused();
   await page.getByLabel("Email", { exact: true }).fill("demo@example.test");
   const story = page.getByRole("textbox", { name: "Your story", exact: true });
   await story.fill("A local test story.");
   await page.getByRole("checkbox", { name: /accept the terms/i }).check();
   await page.getByRole("button", { name: "Submit my story" }).click();
   await expect(page.getByRole("alert").filter({ hasText: "Couldn’t send your story" })).toBeVisible();
   await expect(story).toHaveValue("A local test story.");
   await page.getByRole("button", { name: "Submit my story" }).click();
   await expect(page.getByText("Thank you. Your story was submitted.")).toBeVisible();
   await expect(story).toHaveValue("");
});

test("public landing pages fit a 320 pixel viewport", async ({ page }) => {
   await page.setViewportSize({ width: 320, height: 700 });
   for (const route of ["/", "/shop", "/shop/custom", "/community", "/ageofemotions"]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
   }
});

test("reader testimonials use a keyboard-scrollable track without navigation buttons", async ({ page }) => {
   await page.goto("/ageofemotions");
   const carousel = page.getByRole("region", { name: "What readers say" });
   const track = carousel.getByRole("group", { name: "Scroll through testimonials" });
   const sara = carousel.getByText("Sara Contramaestre", { exact: true });

   await carousel.scrollIntoViewIfNeeded();
   await expect(track).toHaveCSS("scrollbar-width", "none");
   await expect(carousel.getByText("Michel Leroy", { exact: true })).toBeInViewport();
   await expect(carousel.getByRole("button")).toHaveCount(0);
   await expect(track.getByRole("figure")).toHaveCount(4);
   await expect(sara).not.toBeInViewport();
   await expect(track.getByRole("figure").first()).toHaveCSS("background-image", /radial-gradient/);
   await track.press("ArrowRight");
   await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
   await expect(track).toBeFocused();
   await track.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" }));
   await expect(sara).toBeInViewport();
});

test("commission formats keep their expandable layout and work with the keyboard", async ({ page }) => {
   await page.goto("/shop/custom");
   const digital = page.locator("summary").filter({ hasText: "Digital Art Format" });
   const request = page.getByRole("link", { name: "Request digital art" });
   await expect(request).toBeHidden();
   await digital.press("Enter");
   await expect(request).toBeVisible();
   await expect(page.getByText("$175 USD", { exact: true })).toBeVisible();
   await digital.press("Enter");
   await expect(request).toBeHidden();
});

test("mobile navigation opens from the left, traps focus, and restores the hamburger on dismissal", async ({ page, isMobile }) => {
   test.skip(!isMobile, "The desktop navigation stays open.");
   await page.goto("/");
   const menu = page.getByRole("button", { name: "Menu" });
   const navigation = page.getByRole("navigation", { name: "Main navigation" });
   const drawer = page.getByRole("dialog", { name: "Daya Muneton", exact: true });
   expect((await menu.boundingBox())!.x).toBeLessThan(20);
   await expect(menu.locator("svg")).toHaveCount(1);
   await expect(navigation.getByRole("link", { name: "Shop", exact: true })).toBeHidden();
   await menu.press("Enter");
   await expect(drawer).toBeVisible();
   await expect(drawer.getByRole("button", { name: "Close menu" })).toBeFocused();
   await expect.poll(async () => (await drawer.boundingBox())!.x).toBe(0);
   expect(await drawer.evaluate((element) => element.matches(":modal"))).toBe(true);
   await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
   await drawer.getByRole("link", { name: "Emotional Education", exact: true }).focus();
   await page.keyboard.press("Tab");
   await expect(drawer.getByRole("button", { name: "Close menu" })).toBeFocused();
   await drawer.getByRole("link", { name: "Shop", exact: true }).press("Escape");
   await expect(menu).toBeFocused();
   await expect(menu).toHaveAttribute("aria-expanded", "false");
   await expect(drawer).toBeHidden();
   await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
   await menu.click();
   await page.mouse.click(page.viewportSize()!.width - 8, 200);
   await expect(drawer).toBeHidden();
   await expect(menu).toBeFocused();
   await menu.click();
   await drawer.getByRole("link", { name: "Shop", exact: true }).click();
   await expect(page).toHaveURL(/\/shop$/);
   await expect(drawer).toBeHidden();
   await expect(page.getByRole("heading", { name: "Art Shop", exact: true })).toBeVisible();
   await page.emulateMedia({ reducedMotion: "reduce" });
   await menu.click();
   await expect(drawer).toHaveCSS("animation-name", "none");
   await page.setViewportSize({ width: 1440, height: 900 });
   await expect(drawer).toBeHidden();
   await expect(menu).toBeHidden();
   await expect(navigation.getByRole("link", { name: "Daya Muneton", exact: true })).toBeVisible();
   await expect(navigation.getByRole("link", { name: "Shop", exact: true })).toBeVisible();
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
      description: "Local sample for gallery testing.",
      techniques: ["Mixed media"],
      images: [imageUrl, "/DayaMunetonB&WArt.jpg"],
   });
   expect((await getDoc(artwork)).data()?.price).toBe(125);
   await page.goto("/shop/heads");
   const art = page.locator(`a[href="/shop/heads/${artwork.id}"]`);
   await expect(art).toBeVisible();
   await expect.poll(() => art.locator("img").evaluate(
      (element) => element instanceof HTMLImageElement ? element.naturalWidth : 0,
   )).toBeGreaterThan(0);
   await art.click();
   const secondView = page.getByRole("button", { name: "View image 2" });
   await secondView.press("Enter");
   await expect(secondView).toHaveAttribute("aria-pressed", "true");
   await expect(page.locator(".product-gallery-main img")).toHaveAttribute("src", /\/artwork\/dayamunetonb-wart-/);
   await deleteDoc(artwork);
   await deleteObject(object);
   await signOut(auth);
});
