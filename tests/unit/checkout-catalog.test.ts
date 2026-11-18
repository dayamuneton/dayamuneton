import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalOrderItem, parseSelections } from "../../features/checkout/catalog-items";

const painting = { name: "Rey Barreto", price: 5000, status: 1, handle: "rey-barreto", category: "memorials" };

test("checkout takes artwork price and identity from the catalog", () => {
   const [selection] = parseSelections([{ handle: "/shop/memorials/rey-barreto", name: "Forged", price: .5 }]);
   const item = canonicalOrderItem("artwork-id", "products", painting, selection);
   assert.equal(item.price, 5000);
   assert.equal(item.name, "Rey Barreto");
   assert.equal(item.catalog, "products");
});

test("checkout supports legacy document IDs and Unicode handles", () => {
   const [selection] = parseSelections([{ handle: "/shop/memorials/pe%C3%B1a-suazo" }]);
   assert.equal(selection.handle, "peña-suazo");
   assert.equal(canonicalOrderItem("legacy-id", "products", { ...painting, handle: undefined }, { handle: "legacy-id" }).handle, "legacy-id");
});

test("checkout rejects sold artwork, wrong collections, invalid URLs, and unconfigured delivery", () => {
   const selection = { handle: "rey-barreto", category: "memorials" };
   assert.throws(() => canonicalOrderItem("id", "products", { ...painting, status: 0 }, selection));
   assert.throws(() => canonicalOrderItem("id", "products", painting, { ...selection, category: "heads" }));
   for (const handle of ["/shop/memorials/../", "/other/category/product", "../", "/shop/memorials/product/extra"]) {
      assert.throws(() => parseSelections([{ handle }]));
   }
   assert.throws(() => canonicalOrderItem("id", "pdfproducts", { ...painting, variants: [{ id: "es" }] }, { ...selection, variantId: "es" }));
});
