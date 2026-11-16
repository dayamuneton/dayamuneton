import { equal } from "node:assert/strict";
import { test } from "node:test";
import { isSoldOut } from "../../features/catalog/availability";

test("catalog recognizes legacy and current sold-out statuses", () => {
   equal(isSoldOut({ available: 0 }), true);
   equal(isSoldOut({ status: 0 }), true);
   equal(isSoldOut({ status: "soldout" }), true);
   equal(isSoldOut({ status: "sold out" }), true);
   equal(isSoldOut({ status: 1, available: 1 }), false);
   equal(isSoldOut({ status: "available" }), false);
});
