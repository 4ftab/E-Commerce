// ============================================================
// api.js  —  Central API utility
// All backend calls go through this file.
// Base URL is /api which Vite proxies to http://localhost:5001
// ============================================================

const BASE = "/api";

// Return the stored JWT token (if any)
const getToken = () => localStorage.getItem("AK-STORE-token");

// Build Authorization header when a token exists
const authHeaders = () => {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

// ------------------------------------------------------------
// Helper for calls that need the user to be logged in.
// FIX: the old code did `return res.json()` and never looked at the HTTP
// status, so a failed request (401 expired token, 404, 500 ...) came back as a
// normal-looking object, the cart code carried on as if it had worked and the
// user saw NOTHING happen. Now any non-2xx response throws an Error with the
// backend's message, and a 401 tells the app to log the user out.
// ------------------------------------------------------------
const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: authHeaders(),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401) {
      // token missing / expired (tokens last 1 hour) -> App listens for this
      window.dispatchEvent(new Event("auth-expired"));
    }
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }

  return data;
};

// ---------- AUTH ----------
// (these return the raw JSON because the login form shows the backend message)

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getProfile = () => request("/profile");

// ---------- PRODUCTS ----------

export const getProducts = async () => {
  const res = await fetch(`${BASE}/products`);
  return res.json();
};

// ---------- CATEGORIES ----------

export const getCategories = async () => {
  const res = await fetch(`${BASE}/categories`);
  return res.json();
};

// ---------- CART ----------

// Get the cart (and its items) for the logged-in user
export const fetchCart = () => request("/cart");

// Create a cart for the user (the backend now also does this automatically on add)
export const createCart = () => request("/cart", { method: "POST" });

// Add a product to the cart
export const addCartItem = (productId, quantity = 1) =>
  request("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

// Update quantity of a cart item
export const updateCartItem = (cartItemId, quantity) =>
  request(`/cart/items/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

// Remove a specific item from the cart
export const removeCartItem = (cartItemId) =>
  request(`/cart/items/${cartItemId}`, { method: "DELETE" });

// ---------- ORDERS ----------

// Place an order from the current cart
export const placeOrder = () => request("/orders", { method: "POST" });

// Get all orders for the logged-in user
export const getMyOrders = () => request("/orders");