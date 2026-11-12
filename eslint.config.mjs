import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
   ...nextVitals,
   ...nextTypeScript,
   globalIgnores([".next/**", ".next-local/**", ".cache/**", "out/**", "next-env.d.ts", "test-results/**", "playwright-report/**"]),
   {
      files: ["**/*.{ts,tsx}"],
      rules: {
         "@typescript-eslint/no-explicit-any": "off",
         "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
         "react-hooks/set-state-in-effect": "warn",
         "react-hooks/purity": "warn",
      },
   },
]);
