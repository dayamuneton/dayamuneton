import type Stripe from "stripe";

export function dollarsToCents(value: unknown): number | null {
   if (typeof value !== "number" || !Number.isFinite(value)) return null;
   const cents = Math.round(value * 100);
   if (cents < 50 || cents > 99_999_999) return null;
   return cents / 100 === value ? cents : null;
}

export function formatLineItems(input: unknown): Stripe.Checkout.SessionCreateParams.LineItem[] | null {
   if (!Array.isArray(input) || input.length === 0 || input.length > 100) return null;

   const lines: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
   for (const item of input) {
      if (!item || typeof item.name !== "string" || !item.name.trim()) return null;
      const cents = dollarsToCents(item.price);
      if (cents === null) return null;

      const image = item.featuredImage || (Array.isArray(item.images) && item.images[0]);
      lines.push({
         price_data: {
            currency: "usd",
            product_data: {
               name: item.name,
               ...(typeof image === "string" && image.startsWith("https://") ? { images: [image] } : {}),
            },
            unit_amount: cents,
         },
         quantity: 1,
      });
   }
   return lines;
}

export function sameOriginUrl(value: unknown, origin: string, fallback = "/"): string {
   if (typeof value !== "string") return new URL(fallback, origin).href;
   try {
      const url = new URL(value, origin);
      if (url.origin === origin && !url.username && !url.password) return url.href;
   } catch {
      // Use the site's fallback when the supplied URL is malformed.
   }
   return new URL(fallback, origin).href;
}
