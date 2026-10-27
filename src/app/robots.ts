import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/versions" },
    sitemap: "https://theysix.ro-mihaiu.xyz/sitemap.xml",
  };
}