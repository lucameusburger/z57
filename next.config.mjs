/** @type {import('next').NextConfig} */
const einblickApiUrl =
  process.env.EINBLICK_API_URL ??
  process.env.NEXT_PUBLIC_EINBLICK_API_URL ??
  "https://actions.einblick.xyz";
const einblickApiHostname = new URL(einblickApiUrl).hostname;

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase from default 1MB to 10MB
    },
  },
  images: {
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
