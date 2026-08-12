import { siteConfig } from "@/data/site";
import { canonicalFor } from "@/utils/urls";

export function GET(): Response {
  const lines = ["User-agent: *", "Allow: /"];

  if (!siteConfig.previewMode) {
    lines.push("", `Sitemap: ${canonicalFor("/sitemap-index.xml").href}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
