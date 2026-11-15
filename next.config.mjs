import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Legacy /farm/<category>/<dn> URLs now live at /dn/<dn>. Permanent redirects
  // so old links and search results keep working.
  async redirects() {
    return [
      ...["terms", "cookies", "tos"].map((page) => ({
        source: `/${page}`,
        destination: `https://wiki.theysix.tech/${page}`,
        permanent: true,
      })),
      {
        source: "/farm",
        destination: "/",
        permanent: true,
      },
      {
        source: "/farm/:category/:dn*",
        destination: "/dn/:dn*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;

