import type { MetadataRoute } from "next";
import { getAllFarms } from "@/lib/farms";
import { getAllWikiArticles } from "@/data/wiki/articles";

const siteUrl = "https://theysix.ro-mihaiu.xyz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "", "/about", "/socials", "/server", "/server/about", "/server/events",
    "/server/rules", "/server/staff", "/cookies", "/privacy", "/terms", "/tos", "/staff", "/staff/retired",
    "/tricks/java", "/tricks/bedrock", "/wiki",
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const farmRoutes = (await getAllFarms()).map((farm) => ({
    url: `${siteUrl}/farm/${farm.category}/${farm.normalizedDn}`,
    lastModified: farm.date ? new Date(farm.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const wikiRoutes = getAllWikiArticles().map((article) => ({
    url: `${siteUrl}/wiki/${article.edition}/${article.slug}`,
    lastModified: new Date(article.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...farmRoutes, ...wikiRoutes];
}