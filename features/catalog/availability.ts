export function isSoldOut({ available, status }: { available?: unknown; status?: unknown }) {
   return available === 0 || status === 0 || status === "soldout" || status === "sold out";
}
