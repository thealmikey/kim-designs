import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const baseUrl = "https://kiminteriordesigns.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/work", "/studio", "/services", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
