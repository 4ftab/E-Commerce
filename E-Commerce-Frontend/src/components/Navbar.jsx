import { useState } from "react";

import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
console.log("NAVBAR FILE IS LOADED");
function Navbar({
  search,
  setSearch,
  cartItemCount = 0,
  wishlistCount = 0,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  user,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const clearSearch = () => {
    setSearch("");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    console.log("Account button clicked");

    if (onAccountClick) {
      onAccountClick();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <a
          href="#home"
          className="logo"
          onClick={closeMobileMenu}
        >
          AK-STORE
        </a>

        {/* DESKTOP LINKS */}

        <div className="nav-links">
          <a href="#home">
            Home
          </a>

          <a href="#products">
            Products
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#products">
            Deals
          </a>
        </div>

        {/* SEARCH */}

        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </form>

        {/* ACTION BUTTONS */}

        <div className="navbar-actions">

          {/* WISHLIST */}

          <button
            type="button"
            className="nav-icon-button"
            aria-label="Wishlist"
            title="Wishlist"
            onClick={onWishlistClick}
          >
            <Heart
              size={21}
              fill={
                wishlistCount > 0
                  ? "currentColor"
                  : "none"
              }
            />

            {wishlistCount > 0 && (
              <span className="nav-badge">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART */}

          <button
            type="button"
            className="nav-icon-button"
            aria-label="Shopping cart"
            title="Shopping cart"
            onClick={onCartClick}
          >
            <ShoppingCart size={21} />

            {cartItemCount > 0 && (
              <span className="nav-badge">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* ACCOUNT */}

          <button
            type="button"
            className="account-button"
            aria-label="Account"
            title="Account"
            onClick={handleAccountClick}
          >
            <User size={19} />

            <span>
              {user
                ? user.name
                : "Account"}
            </span>
          </button>

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>

      {/* MOBILE MENU */}

      {mobileMenuOpen && (
        <div className="mobile-menu">

          <a
            href="#home"
            onClick={closeMobileMenu}
          >
            Home
          </a>

          <a
            href="#products"
            onClick={closeMobileMenu}
          >
            Products
          </a>

          <a
            href="#categories"
            onClick={closeMobileMenu}
          >
            Categories
          </a>

          <a
            href="#products"
            onClick={closeMobileMenu}
          >
            Deals
          </a>

        </div>
      )}
    </nav>
  );
}

export default Navbar;