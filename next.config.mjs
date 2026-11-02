import { networkInterfaces } from "node:os";

/** @type {import('next').NextConfig} */
const einblickApiUrl =
  process.env.EINBLICK_API_URL ??
  process.env.NEXT_PUBLIC_EINBLICK_API_URL ??
  "https://actions.einblick.xyz";
const einblickApiHostname = new URL(einblickApiUrl).hostname;

// Lets a phone on the same network open the dev server at this machine's IP;
// without this Next answers 403 for its scripts and the page never hydrates.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

const nextConfig = {
  allowedDevOrigins: lanAddresses,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase from default 1MB to 10MB
    },
  },
  images: {
    loader: "custom",
    loaderFile: "./app/lib/einblick-image-loader.ts",
    // Each width here becomes a separately billed image transformation for
    // every image on the site, so the list is kept short and every entry is a
    // size Einblick delivers exactly. Next's defaults include 750 and 828,
    // which are not delivered sizes and would be rounded up to a larger one.
    deviceSizes: [640, 768, 1024, 1280, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: einblickApiHostname,
      },
    ],
  },
};

export default nextConfig;
