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
      { source: "/terms", destination: "https://wiki.theysix.tech/tos", permanent: true },
      { source: "/legal/terms", destination: "https://wiki.theysix.tech/tos", permanent: true },
      { source: "/legal/tos", destination: "https://wiki.theysix.tech/tos", permanent: true },
      { source: "/legal/privacy", destination: "https://wiki.theysix.tech/privacy", permanent: true },
      { source: "/legal/cookies", destination: "https://wiki.theysix.tech/cookies", permanent: true },
      { source: "/tos", destination: "https://wiki.theysix.tech/tos", permanent: true },
      { source: "/cookies", destination: "https://wiki.theysix.tech/cookies", permanent: true },
      { source: "/privacy", destination: "https://wiki.theysix.tech/privacy", permanent: true },
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

