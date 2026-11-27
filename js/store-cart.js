import { PRODUCTS } from "./store-data.js";

const STORAGE_KEY = "studio-market-cart";

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(line =>
      line && PRODUCTS.some(product => product.id === line.id) &&
      Number.isInteger(line.quantity) && line.quantity > 0
    );
  } catch {
    return [];
  }
}

let lines = readCart();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Keep the cart usable for this session if browser storage is unavailable.
  }
}

export function getCart() {
  return lines.map(line => ({ ...line, product: PRODUCTS.find(product => product.id === line.id) }));
}

export function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return false;
  const amount = Math.max(1, Math.min(20, Number(quantity) || 1));
  const existing = lines.find(line => line.id === id);
  if (existing) existing.quantity = Math.min(20, existing.quantity + amount);
  else lines.push({ id, quantity: amount });
  persist();
  return true;
}

export function updateQuantity(id, quantity) {
  const line = lines.find(item => item.id === id);
  if (!line) return;
  const amount = Number(quantity);
  if (!Number.isInteger(amount) || amount <= 0) {
    lines = lines.filter(item => item.id !== id);
  } else {
    line.quantity = Math.min(20, amount);
  }
  persist();
}

export function removeFromCart(id) {
  lines = lines.filter(line => line.id !== id);
  persist();
}

export function clearCart() {
  lines = [];
  persist();
}

export function cartCount() {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartTotal() {
  return getCart().reduce((total, line) => total + line.product.price * line.quantity, 0);
}
