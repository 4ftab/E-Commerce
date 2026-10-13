import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import { PLACEHOLDER_IMAGE, handleImageError } from "../utils/placeholder";

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  onBuyNow,
  cartQuantity = 0,
  onUpdateQuantity,
}) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  // + / - buttons shown on the card once the product is in the cart
  const handleIncrease = () => {
    onUpdateQuantity(product.id, cartQuantity + 1);
  };

  const handleDecrease = () => {
    // going from 1 to 0 removes the item from the cart
    onUpdateQuantity(product.id, cartQuantity - 1);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        quantity: 1,
      });
    }
  };

  const handleWishlist = () => {
    onToggleWishlist(product);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  return (
    <article className="product-card">
      {/* ================= PRODUCT IMAGE ================= */}

      <div className="product-image-wrapper">
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />

        {/* Discount */}

        {product.discount > 0 && (
          <span className="product-discount">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist */}

        <button
          type="button"
          className={`product-wishlist-button ${
            isWishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={19}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* Quick View */}

        <button
          type="button"
          className="product-quick-view-button"
          onClick={handleQuickView}
        >
          <Eye size={17} />
          Quick View
        </button>
      </div>

      {/* ================= PRODUCT DETAILS ================= */}

      <div className="product-details">
        {/* Category */}

        <span className="product-category">
          {product.category}
        </span>

        {/* Name */}

        <h3 className="product-name">
          {product.name}
        </h3>

        {/* Rating */}

        <div className="product-rating">
          <Star
            size={16}
            fill="currentColor"
          />

          <strong>
            {product.rating}
          </strong>

          <span>
            ({product.reviews})
          </span>
        </div>

        {/* Price */}

        <div className="product-price">
          <strong>
            ${product.price.toFixed(2)}
          </strong>

          {product.oldPrice && (
            <span>
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="product-actions">
          {/* Add To Cart */}

          {cartQuantity > 0 && onUpdateQuantity ? (
            <div className="product-qty-stepper" aria-label="Quantity in cart">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span>{cartQuantity}</span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />

              Add to Cart
            </button>
          )}

          {/* Buy Now */}

          <button
            type="button"
            className="buy-now-button"
            onClick={handleBuyNow}
          >
            <Zap size={17} />

            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;