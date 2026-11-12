import { createHash } from "crypto";

export const sha256HexHash = (string: string) => {
   const hash = createHash("sha256");
   hash.update(string);
   return hash.digest("hex");
};
export const lowerCaseSha256HexHash = (string: string) => {
   return sha256HexHash(string.toLowerCase());
};
export default sha256HexHash;
