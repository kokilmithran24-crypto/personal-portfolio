export function currentRoute() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };
  if (parts[0] === "products") return { name: "products" };
  if (parts[0] === "product" && parts[1]) return { name: "product", id: decodeURIComponent(parts[1]) };
  if (parts[0] === "cart") return { name: "cart" };
  if (parts[0] === "checkout") return { name: "checkout" };
  return { name: "not-found" };
}

export function navigate(path) {
  const next = "#/" + path.replace(/^\/+/, "");
  if (window.location.hash === next) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = next;
  }
}
