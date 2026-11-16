import { expect, test, type Page } from "@playwright/test";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { auth, db, storage } from "../../integrations/firebase/firebaseConfig";

const password = "local-password";

async function signIn(page: Page, email: string) {
   await page.getByLabel("Email", { exact: true }).fill(email);
   await page.getByLabel("Password", { exact: true }).fill(password);
   await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

test("all public route families share the responsive shell and accessible headings", async ({ page }) => {
   await page.setViewportSize({ width: 320, height: 700 });
   const routes = [
      ["/", "Welcome to my art gallery!"], ["/shop", "Art Shop"], ["/shop/custom", "Custom Art Commissions"],
      ["/shop/heads", "Heads"], ["/shop/bodies", "Bodies"], ["/shop/abstracts", "Abstracts"],
      ["/shop/memorials", "A Latin Gift"], ["/ageofemotions", "Age of Emotions"],
      ["/ageofemotions/freebies", "Freebies"], ["/ageofemotions/colors", "Art Your Emotions"],
      ["/ageofemotions/chemistry", "Chemistry of Emotions"], ["/community", "Be the voice of your song, share your story in “A Latin Gift”"],
      ["/about", "Daya Muneton"], ["/legal/privacy-policy", "Privacy Policy"],
      ["/legal/terms-of-service", "Terms Of Service"], ["/auth/login", "Sign in"],
      ["/auth/signup", "Create an account"], ["/thankyou", "Welcome to your journey with art and emotions"],
      ["/support/thanks", "Thank you for your support"], ["/500", "Something went wrong"],
      ["/shop/unknown", "Page not found"], ["/ageofemotions/colors/missing-guide", "Page not found"],
   ];
   for (const [route, heading] of routes) {
      await test.step(route, async () => {
         await page.goto(route);
         await expect(page.getByRole("main")).toHaveCount(1);
         const title = page.getByRole("heading", { level: 1 });
         await expect(title).toHaveText(heading);
         await expect(title).toBeInViewport();
         await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(1);
         await expect(page.getByRole("contentinfo")).toHaveCount(route === "/" || route === "/shop" ? 0 : 1);
         expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
            .toBeLessThanOrEqual(1);
      });
   }
});

test("sign-in returns to the cart and a guide can be added, removed, and checked out locally", async ({ page }, info) => {
   const unique = info.project.name + "-" + Date.now();
   const email = "cart-" + unique + "@example.test";
   const { user } = await createUserWithEmailAndPassword(auth, email, password);
   const guide = doc(db, "pdfproducts", "guide-" + unique);
   const guidePath = "/ageofemotions/colors/" + guide.id;
   const image = "/ArtEmotions.png";
   try {
      await setDoc(guide, {
         name: "Local reflection guide", handle: guide.id, category: "colors", price: 7, date: 20261112,
         description: "Explore how art can support reflection.", featuredImage: image, images: [image],
         beneficts: "<p><strong>Reflect through art.</strong></p><div hidden>Secondary text</div>",
         variants: [{ id: "color", title: "Color", image, price: 7, mailerlite_group: "" }],
      });

      await page.goto("/checkout");
      await expect(page).toHaveURL(/auth\/login\?src=%2Fcheckout/);
      await page.getByRole("button", { name: "Show password" }).click();
      await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
      await signIn(page, email);
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(page.getByRole("heading", { name: "Your cart is empty." })).toBeVisible();

      await page.goto(guidePath);
      await expect(page.getByRole("heading", { name: "Local reflection guide", level: 1 })).toBeVisible();
      await expect(page.locator(".detail-copy strong")).toHaveText("Reflect through art.");
      await expect(page.locator(".detail-copy [hidden]")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Color", exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: "Add to cart", exact: true }).click();
      await expect(page.getByRole("button", { name: "Remove from cart" })).toBeVisible();

      await page.goto("/checkout");
      const item = page.getByRole("link", { name: "Local reflection guide (Color)" });
      await expect(item).toHaveAttribute("href", guidePath);
      await page.getByRole("button", { name: "Remove Local reflection guide (Color)" }).click();
      await expect(page.getByRole("heading", { name: "Your cart is empty." })).toBeVisible();

      await page.goto(guidePath);
      await page.getByRole("button", { name: "Add to cart", exact: true }).click();
      await expect(page.getByRole("button", { name: "Remove from cart" })).toBeVisible();
      await page.goto("/checkout");
      await expect(page.getByRole("heading", { name: "Order summary" })).toBeVisible();
      await page.getByRole("button", { name: "Checkout", exact: true }).click();
      await expect(page).toHaveURL(/\/thankyou\?checkout=local$/, { timeout: 15_000 });
      await expect(page.getByText("This was a test checkout. No payment was made or email sent.")).toBeVisible();
   } finally {
      const groups = await Promise.all(["shoppingCarts", "orders"].map((group) => getDocs(
         query(collection(db, group), where(group === "orders" ? "email" : "customerEmail", "==", email)),
      )));
      await Promise.all([deleteDoc(guide), ...groups.flatMap(({ docs }) => docs.map(({ ref }) => deleteDoc(ref)))]);
      await deleteUser(user);
   }
});

test("admins can navigate and save both editor types, including a local upload", async ({ page }, info) => {
   test.setTimeout(60_000);
   const unique = info.project.name + "-" + Date.now();
   const email = "admin-" + unique + "@example.test";
   const { user } = await createUserWithEmailAndPassword(auth, email, password);
   const permission = doc(db, "admins", email);
   const painting = doc(db, "products", "painting-" + unique);
   const guide = doc(db, "pdfproducts", "editor-" + unique);
   const createdGuideName = "New browser guide " + unique;
   const fixture = { category: "heads", name: "Editor painting", images: ["/ShopMyArt.png"], price: 100, date: 20261112, status: 1 };
   try {
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/auth\/login\?src=%2Fadmin$/);
      await signIn(page, email);
      await expect(page.getByRole("heading", { name: "Admin access required" })).toBeVisible();
      await Promise.all([
         setDoc(permission, { enabled: true }),
         setDoc(painting, { ...fixture, handle: painting.id }),
         setDoc(guide, { ...fixture, category: "freebies", handle: guide.id, name: "Editor guide" }),
      ]);

      await page.reload();
      const adminNav = page.getByRole("navigation", { name: "Admin navigation" });
      await expect(adminNav).toBeVisible();
      await adminNav.getByRole("link", { name: "Paintings" }).click();
      await page.locator(`a[href="/admin/paintings/${painting.id}"]`).click();
      await expect(page.getByRole("heading", { name: "Edit painting" })).toBeVisible();
      await page.getByLabel("Price (USD)").fill("120.50");
      await page.getByRole("button", { name: "Save painting" }).click();
      await expect(page.getByText("Changes saved.")).toBeVisible();
      await page.reload();
      await expect(page.getByLabel("Price (USD)")).toHaveValue("120.5");
      await page.getByRole("button", { name: "Delete painting" }).click();
      const confirm = page.getByRole("dialog", { name: "Delete painting" });
      await expect(confirm).toBeVisible();
      await confirm.getByRole("button", { name: "Cancel" }).press("Escape");
      await expect(confirm).toBeHidden();
      await expect(page.getByRole("button", { name: "Delete painting" })).toBeFocused();

      await adminNav.getByRole("link", { name: "Guides" }).click();
      await page.locator(`a[href="/admin/guides/${guide.id}"]`).click();
      await expect(page.getByRole("heading", { name: "Edit guide" })).toBeVisible();
      await page.getByLabel("Benefits").fill("Learn by drawing.");
      await page.getByRole("button", { name: "Save guide" }).click();
      await expect(page.getByText("Changes saved.")).toBeVisible();
      await page.goto("/admin/guides/missing");
      await expect(page.getByText("This item could not be found.")).toBeVisible();
      await page.goto("/admin/paintings/new");
      await expect(page.getByRole("heading", { name: "Add painting" })).toBeVisible();
      await expect(page.getByLabel("Add images")).toBeVisible();
      await page.goto("/admin/guides/new");
      await expect(page.getByRole("heading", { name: "Add guide" })).toBeVisible();
      await page.getByLabel("Name", { exact: true }).fill(createdGuideName);
      await page.getByLabel("Add images").setInputFiles("public/DayaMunetonB&WArt.jpg");
      await page.getByRole("button", { name: "Add option" }).click();
      await page.getByLabel("Title", { exact: true }).fill("Spanish");
      await page.getByRole("button", { name: "Save guide" }).click();
      await expect(page.getByRole("heading", { name: "Edit guide" })).toBeVisible();
      await expect(page.getByLabel("Name", { exact: true })).toHaveValue(createdGuideName);
      const uploadedImage = page.locator(".editor-images img").first();
      await uploadedImage.scrollIntoViewIfNeeded();
      await expect.poll(() => uploadedImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
   } finally {
      const created = await getDocs(query(collection(db, "pdfproducts"), where("name", "==", createdGuideName)));
      const files = created.docs.flatMap((item) => (item.get("images") ?? []) as string[])
         .map((url) => decodeURIComponent(new URL(url).pathname.split("/o/")[1]));
      await Promise.allSettled(files.map((url) => deleteObject(ref(storage, url))));
      await Promise.all([deleteDoc(permission), deleteDoc(painting), deleteDoc(guide), ...created.docs.map(({ ref }) => deleteDoc(ref))]);
      await deleteUser(user);
   }
});

test("guests can submit an artwork offer and claim a free guide locally", async ({ page }, info) => {
   const unique = info.project.name + "-" + Date.now();
   const painting = doc(db, "products", "offer-" + unique);
   const guide = doc(db, "pdfproducts", "free-" + unique);
   try {
      await Promise.all([
         setDoc(painting, { category: "abstracts", name: "Local color study", price: 100, images: ["/ShopMyArt.png"] }),
         setDoc(guide, { category: "freebies", name: "Local free guide", price: 0, handle: guide.id, images: ["/Freebies.png"] }),
      ]);
      await page.goto("/shop/abstracts");
      await page.getByRole("link", { name: "Local color study" }).click();
      await expect(page.getByRole("heading", { name: "Local color study", level: 1 })).toBeVisible();
      await page.getByRole("button", { name: "Make an offer" }).click();
      await page.getByLabel("Name", { exact: true }).fill("Local Tester");
      await page.getByLabel("Email", { exact: true }).fill("guest@example.test");
      await page.getByRole("checkbox", { name: /accept the terms/i }).check();
      await page.getByRole("button", { name: "Submit my offer" }).click();
      await expect(page.getByText("Thank you. Your offer was sent.")).toBeVisible();
      await page.goto("/shop/heads/" + painting.id);
      await expect(page.getByRole("heading", { name: "Page not found", level: 1 })).toBeVisible();

      await page.goto("/ageofemotions/freebies/" + guide.id);
      await page.getByRole("button", { name: "Acquire Guide" }).click();
      await page.getByLabel("Name", { exact: true }).fill("Local Tester");
      await page.getByLabel("Email", { exact: true }).fill("guest@example.test");
      await page.getByRole("checkbox", { name: /accept the terms/i }).check();
      await page.getByRole("button", { name: "Acquire Guide" }).last().click();
      await expect(page).toHaveURL(/\/thankyou$/, { timeout: 15_000 });
      await expect(page.getByText("This was a test checkout. No payment was made or email sent.")).toBeVisible();
   } finally {
      await Promise.all([deleteDoc(painting), deleteDoc(guide)]);
   }
});
