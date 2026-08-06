export function isPublicBrowsingPath(pathname: string): boolean {
  return (
    pathname === "/products" ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    (pathname.startsWith("/products/") &&
      !pathname.endsWith("/edit") &&
      pathname !== "/products/new")
  );
}
