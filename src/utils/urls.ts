const base = import.meta.env.BASE_URL || "/";
const normalizedBase = base === "/" ? "/" : `${base.replace(/\/+$/, "")}/`;

export function pathFor(path: string): string {
  if (/^(?:https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = `/${path.replace(/^\/+/, "")}`;
  if (normalizedBase !== "/" && normalized.startsWith(normalizedBase)) return normalized;
  if (normalizedBase === "/") return normalized;
  return `${normalizedBase}${normalized.slice(1)}`;
}

export function canonicalFor(path: string): URL {
  const origin = import.meta.env.SITE || "https://righthandpi.com";
  return new URL(pathFor(path), origin);
}

export function isCurrentPath(currentPath: string, href: string): boolean {
  const current = currentPath.replace(/\/+$/, "") || "/";
  const target = pathFor(href).split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  return current === target || (target !== "/" && current.endsWith(target));
}
