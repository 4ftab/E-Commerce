import "./App.css";
import { useEffect, useMemo, useState, useCallback } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import QuickViewModal from "./components/QuickViewModal";
import CheckoutModal from "./components/CheckoutModal";
import AccountModal from "./components/AccountModal";
import OrderHistoryModal from "./components/OrderHistoryModal";
import Footer from "./components/Footer";

import {
  getProducts,
  getCategories,
  fetchCart,
  createCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  placeOrder,
  getMyOrders,
} from "./api";
import { PLACEHOLDER_IMAGE } from "./utils/placeholder";

function App() {
  // =========================================================
  // SEARCH
  // =========================================================
  const [search, setSearch] = useState("");

  // =========================================================
  // PRODUCTS & CATEGORIES  (from backend)
  // =========================================================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productsLoading, setProductsLoading] = useState(true);

  // =========================================================
  // AUTH  — user object + JWT token
  // =========================================================
  const [user, setUser] = useState(() => {
    try {
      const saved  = localStorage.getItem("AK-STORE-user");
      const token  = localStorage.getItem("AK-STORE-token");
      // Only restore user session if a token also exists
      return (saved && token) ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accountOpen, setAccountOpen] = useState(false);

  // =========================================================
  // CART  (backend-driven when logged in, local otherwise)
  // =========================================================
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Small pop-up message so the user always gets feedback (added / error)
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // =========================================================
  // WISHLIST  (localStorage only — no backend endpoint)
  // =========================================================
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("AK-STORE-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistOpen, setWishlistOpen] = useState(false);

  // =========================================================
  // MODALS
  // =========================================================
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  // =========================================================
  // LOAD PRODUCTS & CATEGORIES ON MOUNT
  // =========================================================
  useEffect(() => {
    const load = async () => {
      setProductsLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        // Normalise: backend returns { id, name, price, category_name }
        // Frontend expects { id, name, price, category, image, ... }
        const normalised = Array.isArray(prods)
          ? prods.map((p) => ({
              ...p,
              category: p.category_name || "General",
              price:    parseFloat(p.price),
              oldPrice: p.old_price ? parseFloat(p.old_price) : null,
              discount: parseInt(p.discount) || 0,
              // FIX: fall back to a neutral placeholder, NOT a real product photo
              image:    p.image || PLACEHOLDER_IMAGE,
              rating:   parseFloat(p.rating) || 4.5,
              reviews:  parseInt(p.reviews)  || 0,
              stock:    p.stock !== undefined ? Boolean(p.stock) : true,
            }))
          : [];

        setProducts(normalised);

        // Build category list from what the backend returns
        const catNames = Array.isArray(cats)
          ? cats.map((c) => c.name)
          : [];
        setCategories(["All", ...catNames]);
      } catch (err) {
        console.error("Failed to load products/categories:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    load();
  }, []);

  // =========================================================
  // LOAD CART FROM BACKEND when user is logged in
  // =========================================================
  const loadBackendCart = useCallback(async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const data = await fetchCart();
      if (data.cart && Array.isArray(data.cart.items)) {
        // Backend items: { id, product_id, name, price, quantity }
        // Map to frontend shape expected by CartDrawer
        const mapped = data.cart.items.map((item) => ({
          cartItemId: item.id,        // backend cart_items.id (needed for update/delete)
          id: item.product_id,        // product id
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          category: item.category,
          image: item.image || PLACEHOLDER_IMAGE,
        }));
        setCart(mapped);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadBackendCart();
    } else {
      setCart([]);
    }
  }, [user, loadBackendCart]);

  // =========================================================
  // SESSION EXPIRED — api.js fires this when the backend answers 401
  // (JWT tokens last 1 hour). Log the user out so they can log in again.
  // =========================================================
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setCart([]);
      showToast("Your session expired. Please log in again.", "error");
    };
    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, [showToast]);

  // =========================================================
  // SAVE USER to localStorage whenever it changes
  // =========================================================
  useEffect(() => {
    if (user) {
      localStorage.setItem("AK-STORE-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("AK-STORE-user");
      localStorage.removeItem("AK-STORE-token");
    }
  }, [user]);

  // =========================================================
  // SAVE WISHLIST to localStorage
  // =========================================================
  useEffect(() => {
    localStorage.setItem("AK-STORE-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // =========================================================
  // DERIVED COUNTS
  // =========================================================
  const cartItemCount = useMemo(
    () => cart.reduce((t, i) => t + i.quantity, 0),
    [cart]
  );
  const wishlistCount = wishlist.length;
  const cartSubtotal = useMemo(
    () => cart.reduce((t, i) => t + i.price * i.quantity, 0),
    [cart]
  );

  // =========================================================
  // CART — ADD   (returns true when it worked)
  // =========================================================
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      openAccount();
      return false;
    }
    try {
      await addCartItem(product.id, quantity);
      await loadBackendCart();
      showToast(`${product.name} added to cart`);
      return true;
    } catch (err) {
      console.error("addToCart error:", err);
      showToast(err.message || "Could not add to cart", "error");
      return false;
    }
  };

  // =========================================================
  // CART — UPDATE QUANTITY  (+ / - buttons)
  // Updates the screen immediately, then syncs with the backend.
  // =========================================================
  const updateCartQuantity = async (productId, newQuantity) => {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    // optimistic update so the number changes instantly
    setCart((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, quantity: newQuantity } : i
      )
    );

    try {
      await updateCartItem(item.cartItemId, newQuantity);
    } catch (err) {
      console.error("updateCartQuantity error:", err);
      showToast(err.message || "Could not update quantity", "error");
      await loadBackendCart(); // put the screen back in sync with the database
    }
  };

  // =========================================================
  // CART — REMOVE
  // =========================================================
  const removeFromCart = async (productId) => {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    try {
      await removeCartItem(item.cartItemId);
      await loadBackendCart();
    } catch (err) {
      console.error("removeFromCart error:", err);
      showToast(err.message || "Could not remove item", "error");
    }
  };

  // =========================================================
  // CART — CLEAR (remove all items one by one)
  // =========================================================
  const clearCart = async () => {
    try {
      await Promise.all(cart.map((item) => removeCartItem(item.cartItemId)));
      setCart([]);
    } catch (err) {
      console.error("clearCart error:", err);
      showToast(err.message || "Could not clear cart", "error");
      await loadBackendCart();
    }
  };

  // =========================================================
  // WISHLIST
  // =========================================================
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      return exists
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product];
    });
  };

  const removeFromWishlist = (productId) =>
    setWishlist((prev) => prev.filter((i) => i.id !== productId));

  const addWishlistItemToCart = async (product) => {
    // only take it off the wishlist if it really was added to the cart
    const added = await addToCart(product);
    if (added) removeFromWishlist(product.id);
  };

  // =========================================================
  // BUY NOW — put single item in cart then open checkout
  // =========================================================
  const buyNow = async (product) => {
    if (!user) {
      alert("Please log in to purchase.");
      openAccount();
      return;
    }
    try {
      // Clear existing cart first, then add this item
      await clearCart();
      await addCartItem(product.id, product.quantity || 1);
      await loadBackendCart();

      closeAll();
      setCheckoutOpen(true);
    } catch (err) {
      console.error("buyNow error:", err);
      showToast(err.message || "Could not start checkout", "error");
    }
  };

  // =========================================================
  // ORDERS — COMPLETE (calls backend)
  // =========================================================
  const completeOrder = async () => {
    if (cart.length === 0) return;
    try {
      const result = await placeOrder();
      if (result.orderId) {
        setCart([]);
        // Refresh orders list
        const ordersData = await getMyOrders();
        if (Array.isArray(ordersData.orders)) {
          setOrders(ordersData.orders);
        }
        return true;
      } else {
        alert(result.message || "Failed to place order.");
        return false;
      }
    } catch (err) {
      console.error("completeOrder error:", err);
      alert(err.message || "Failed to place order.");
      return false;
    }
  };

  // =========================================================
  // LOAD ORDERS when order history opens
  // =========================================================
  const openOrderHistory = async () => {
    closeAll();
    setOrderHistoryOpen(true);
    if (user) {
      try {
        const data = await getMyOrders();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }
  };

  // =========================================================
  // HELPERS — close all panels
  // =========================================================
  const closeAll = () => {
    setCartOpen(false);
    setWishlistOpen(false);
    setAccountOpen(false);
    setOrderHistoryOpen(false);
    setQuickViewProduct(null);
    setCheckoutOpen(false);
  };

  const openCart = () => { closeAll(); setCartOpen(true); };
  const closeCart = () => setCartOpen(false);

  const openWishlist = () => { closeAll(); setWishlistOpen(true); };
  const closeWishlist = () => setWishlistOpen(false);

  const openQuickView = (product) => { closeAll(); setQuickViewProduct(product); };
  const closeQuickView = () => setQuickViewProduct(null);

  const openCheckout = () => {
    if (cart.length === 0) { alert("Your cart is empty."); return; }
    closeAll();
    setCheckoutOpen(true);
  };
  const closeCheckout = () => setCheckoutOpen(false);

  const openAccount = () => { closeAll(); setAccountOpen(true); };
  const closeAccount = () => setAccountOpen(false);
  const closeOrderHistory = () => setOrderHistoryOpen(false);

  // =========================================================
  // AUTH HANDLERS (called by AccountModal)
  // =========================================================
  const handleLogin = (loggedInUser) => setUser(loggedInUser);
  const handleLogout = () => { setUser(null); setCart([]); };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        cartItemCount={cartItemCount}
        wishlistCount={wishlistCount}
        onCartClick={openCart}
        onWishlistClick={openWishlist}
        onAccountClick={openAccount}
        user={user}
      />

      <Hero />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <ProductGrid
        products={products}
        loading={productsLoading}
        search={search}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        wishlist={wishlist}
        onQuickView={openQuickView}
        onBuyNow={buyNow}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCart}
        cart={cart}
        loading={cartLoading}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        subtotal={cartSubtotal}
        onCheckout={openCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={closeWishlist}
        wishlist={wishlist}
        onRemove={removeFromWishlist}
        onAddToCart={addWishlistItemToCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={closeQuickView}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
        onToggleWishlist={toggleWishlist}
        isWishlisted={
          quickViewProduct
            ? wishlist.some((i) => i.id === quickViewProduct.id)
            : false
        }
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={closeCheckout}
        cart={cart}
        subtotal={cartSubtotal}
        onOrderComplete={completeOrder}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={closeAccount}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOrderHistory={openOrderHistory}
      />

      <OrderHistoryModal
        isOpen={orderHistoryOpen}
        onClose={closeOrderHistory}
        orders={orders}
      />

      <Footer />

      {toast && (
        <div key={toast.id} className={`app-toast app-toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;