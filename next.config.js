const preview = process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_SITE_ENV === "preview"
   || (process.env.VERCEL === "1" && process.env.NEXT_PUBLIC_SITE_ENV !== "production");
const local = !preview && process.env.NEXT_PUBLIC_SITE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   bundlePagesRouterDependencies: true,
   // Bundle ESM dependencies that Vercel's CommonJS function loader cannot require.
   transpilePackages: [
      "sanitize-html", "htmlparser2", "domelementtype", "domhandler", "domutils", "entities",
      "firebase-admin", "jwks-rsa", "jose",
   ],
   serverExternalPackages: ["@google-cloud/firestore", "google-gax", "@grpc/grpc-js"],
   experimental: { esmExternals: "loose" },
   ...(preview && { env: { NEXT_PUBLIC_SITE_ENV: "preview" } }),
   async headers() {
      return [...(preview ? [{
         source: "/:path*",
         headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      }] : []), {
         source: "/artwork/:path*",
         headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      }];
   },
   distDir: process.env.LOCAL_NEXT_BUILD === "1" ? ".next-local" : ".next",
   images: {
      dangerouslyAllowLocalIP: local,
      remotePatterns: local ? [
         {
            protocol: "http",
            hostname: "127.0.0.1",
            port: "9199",
            pathname: "/v0/b/demo-dayamuneton.appspot.com/o/**",
         },
      ] : preview ? [] : [
         {
            protocol: "https",
            hostname: "**.googleusercontent.com",
         },
         {
            protocol: "https",
            hostname: "**.googleapis.com",
         },
      ],
   },
};

module.exports = nextConfig;
