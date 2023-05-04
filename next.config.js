/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   images: {
      remotePatterns: [
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
   i18n: {
      locales: ["en"],
      defaultLocale: "en",
   },
};

module.exports = nextConfig;
