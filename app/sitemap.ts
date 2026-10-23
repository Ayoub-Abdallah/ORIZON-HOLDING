import type { MetadataRoute } from "next";
import { divisions, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/solutions", "/ai", "/enterprise", "/about", "/careers", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...divisions.map((d) => ({ url: `${site.url}/solutions/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
