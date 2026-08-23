export function routeHref(slugOrPath: string) {
  const value = String(slugOrPath || "").trim();
  if (!value || value === "/") return "/";
  if (/^(?:https?:|#)/i.test(value)) return value;

  const match = value.match(/^([^?#]*)(.*)$/);
  const pathname = (match?.[1] || "/").replace(/^\/+|\/+$/g, "");
  const suffix = match?.[2] || "";
  return pathname ? `/${pathname}/${suffix}` : `/${suffix}`;
}

export function absoluteRoute(baseUrl: string, slugOrPath: string) {
  return new URL(routeHref(slugOrPath), baseUrl).toString();
}
