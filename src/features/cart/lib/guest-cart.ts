import type { CartDto, CartItemDto, Product } from "@/lib/generated/api";

export interface GuestCartItem {
  productId: number;
  quantity: number;
  product: Product;
}

const STORAGE_KEY = "nest_auth_guest_cart";

let cachedItems: GuestCartItem[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function snapshot(): GuestCartItem[] {
  if (cachedItems === null) {
    cachedItems = readStorage();
  }
  return cachedItems;
}

function writeStorage(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable — keep in-memory state only
  }
}

function commit(next: GuestCartItem[]): GuestCartItem[] {
  cachedItems = next;
  writeStorage(next);
  for (const listener of listeners) {
    listener();
  }
  return next;
}

/** React `useSyncExternalStore` snapshot of the guest cart. */
export function getGuestCartSnapshot(): GuestCartItem[] {
  return snapshot();
}

export function subscribeGuestCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

export function guestCartToDto(items: GuestCartItem[]): CartDto {
  const mapped: CartItemDto[] = items.map((item) => ({
    id: item.productId,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
  }));
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
    0,
  );
  return {
    items: mapped,
    subtotal: round(subtotal),
    total: round(subtotal),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function addToGuestCart(
  productId: number,
  quantity: number,
  product: Product,
): GuestCartItem[] {
  const items = snapshot();
  const existing = items.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity = Math.min(999, existing.quantity + quantity);
    existing.product = product;
  } else {
    items.push({
      productId,
      quantity: Math.min(999, quantity),
      product,
    });
  }
  return commit([...items]);
}

export function updateGuestQuantity(
  productId: number,
  quantity: number,
): GuestCartItem[] {
  const items = snapshot().map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
  return commit(items);
}

export function removeFromGuestCart(productId: number): GuestCartItem[] {
  const items = snapshot().filter((item) => item.productId !== productId);
  return commit(items);
}

export function clearGuestCart(): GuestCartItem[] {
  return commit([]);
}
