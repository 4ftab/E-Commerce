import { useEffect, useState } from "react";
import {
  X,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import { PLACEHOLDER_IMAGE, handleImageError } from "../utils/placeholder";

function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) {
    return null;
  }

  const handleDecrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleIncrease = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  // FIX: one request with the chosen quantity. The old loop fired several
  // un-awaited requests at once, which raced each other and created duplicate
  // cart rows.
  const handleAddToCart = async () => {
    const added = await onAddToCart(product, quantity);

    if (added) {
      onClose();
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        quantity,
      });
    }
  };

  const handleWishlist = () => {
    onToggleWishlist(product);
  };

  return (
    <div
      className="quick-view-overlay"
      onClick={onClose}
    >
      <div
        className="quick-view-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Close */}

        <button
          type="button"
          className="quick-view-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={24} />
        </button>

        <div className="quick-view-content">
          {/* Image */}

          <div className="quick-view-image-wrapper">
            <img
              src={product.image || PLACEHOLDER_IMAGE}
              alt={product.name}
              className="quick-view-image"
              onError={handleImageError}
            />

            {product.discount > 0 && (
              <span className="quick-view-discount">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Details */}

          <div className="quick-view-details">
            <span className="quick-view-category">
              {product.category}
            </span>

            <h2>{product.name}</h2>

            {/* Rating */}

            <div className="quick-view-rating">
              <Star
                size={18}
                fill="currentColor"
              />

              <strong>
                {product.rating}
              </strong>

              <span>
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}

            <div className="quick-view-price">
              <strong>
                ${product.price.toFixed(2)}
              </strong>

              {product.oldPrice && (
                <span>
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}

            <p className="quick-view-description">
              {product.description ||
                `Experience great quality with the ${product.name}. This product is carefully selected for our AK-STORE collection and offers excellent value for your money.`}
            </p>

            {/* Quantity */}

            <div className="quick-view-quantity">
              <span>Quantity</span>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={
                    handleDecrease
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <strong>
                  {quantity}
                </strong>

                <button
                  type="button"
                  onClick={
                    handleIncrease
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}

            <div className="quick-view-actions">
              <button
                type="button"
                className="quick-view-cart-button"
                onClick={
                  handleAddToCart
                }
              >
                <ShoppingCart
                  size={19}
                />

                Add {quantity} to Cart
              </button>

              <button
                type="button"
                className="quick-view-buy-button"
                onClick={
                  handleBuyNow
                }
              >
                <Zap size={19} />

                Buy Now
              </button>

              <button
                type="button"
                className={`quick-view-wishlist-button ${
                  isWishlisted
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleWishlist
                }
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;