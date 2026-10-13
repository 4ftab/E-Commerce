import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Loader,
} from "lucide-react";

import ProductCard from "./ProductCard";

function ProductGrid({
  products = [],
  loading = false,
  search = "",
  selectedCategory = "All",
  setSelectedCategory,
  onAddToCart,
  onToggleWishlist,
  wishlist = [],
  onQuickView,
  onBuyNow,
  cart = [],
  onUpdateQuantity,
}) {
  // =========================================================
  // FILTER STATES
  // =========================================================

  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minDiscount, setMinDiscount] = useState("");

  // =========================================================
  // FILTER + SORT PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    const searchText = search.trim().toLowerCase();
    if (searchText) {
      result = result.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Min price
    if (minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    // Max price
    if (maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    // Min rating
    if (minRating !== "") {
      result = result.filter(
        (product) => product.rating >= Number(minRating)
      );
    }

    // Min discount — only filter if product has a discount field
    if (minDiscount !== "") {
      result = result.filter(
        (product) =>
          product.discount !== undefined &&
          product.discount >= Number(minDiscount)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    sortBy,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setMinDiscount("");
    setSortBy("featured");
    if (setSelectedCategory) setSelectedCategory("All");
  };

  // =========================================================
  // CHECK WISHLIST
  // =========================================================

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  // How many of this product are in the cart (0 if none)
  const cartQuantityOf = (productId) =>
    cart.find((item) => item.id === productId)?.quantity || 0;

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section className="products-section" id="products">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px 0",
            gap: "12px",
            color: "#888",
          }}
        >
          <Loader
            size={28}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <span style={{ fontSize: "16px" }}>
            Loading products…
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" id="products">
      <div className="products-container">

        {/* ================= HEADER ================= */}

        <div className="products-header">
          <div>
            <p className="section-label">OUR PRODUCTS</p>
            <h2>Explore Our Collection</h2>
            <p>Discover products selected just for you.</p>
          </div>

          {/* Sort */}
          <div className="sort-wrapper">
            <label htmlFor="sort-products">Sort by</label>
            <div className="sort-select-wrapper">
              <select
                id="sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}

        <div className="filter-bar">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Beauty">Beauty</option>
              <option value="Accessories">Accessories</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              min="0"
              placeholder="$0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          {/* Max Price */}
          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              min="0"
              placeholder="$1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Rating */}
          <div className="filter-group">
            <label>Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>

          {/* Discount */}
          <div className="filter-group">
            <label>Discount</label>
            <select
              value={minDiscount}
              onChange={(e) => setMinDiscount(e.target.value)}
            >
              <option value="">Any Discount</option>
              <option value="10">10%+ Off</option>
              <option value="20">20%+ Off</option>
              <option value="30">30%+ Off</option>
            </select>
          </div>

          {/* Clear */}
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            <X size={16} />
            Clear
          </button>
        </div>

        {/* ================= RESULTS COUNT ================= */}

        <div className="products-result-info">
          <span>
            Showing{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>

          {search && (
            <span>
              for "<strong>{search}</strong>"
            </span>
          )}

          {selectedCategory !== "All" && (
            <span>
              in <strong>{selectedCategory}</strong>
            </span>
          )}
        </div>

        {/* ================= PRODUCTS ================= */}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No Products Found</h3>
            <p>Try changing your search or filters.</p>
            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted(product.id)}
                onQuickView={onQuickView}
                onBuyNow={onBuyNow}
                cartQuantity={cartQuantityOf(product.id)}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ProductGrid;