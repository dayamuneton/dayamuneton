import assert from "node:assert/strict";
import { test } from "node:test";
import { dollarsToCents, formatLineItems, sameOriginUrl } from "../../integrations/stripe/line-items";

test("USD amounts convert exactly to cents within the supported range", () => {
   assert.equal(dollarsToCents(0.5), 50);
   assert.equal(dollarsToCents(19.99), 1999);
   for (const value of [0, -1, 0.499, 1.001, NaN, Infinity, "5", 1_000_000]) {
      assert.equal(dollarsToCents(value), null);
   }
});

test("checkout rejects missing or malformed line items", () => {
   for (const input of [undefined, [], [{}], [null], [{ name: " ", price: 5 }]]) {
      assert.equal(formatLineItems(input), null);
   }
   const item = formatLineItems([{ name: "Support My Work", price: 5 }])?.[0];
   assert.equal(item?.price_data?.unit_amount, 500);
   assert.equal(item?.price_data?.product_data?.name, "Support My Work");
});

test("checkout redirects stay on the configured site", () => {
   const origin = "https://example.test";
   assert.equal(sameOriginUrl("/thankyou", origin), origin + "/thankyou");
   assert.equal(sameOriginUrl("//other.test/checkout", origin), origin + "/");
   assert.equal(sameOriginUrl("javascript:alert(1)", origin), origin + "/");
});
