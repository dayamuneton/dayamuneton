const local = process.env.NEXT_PUBLIC_SITE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   async headers() {
      return [{
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
      ] : [
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
