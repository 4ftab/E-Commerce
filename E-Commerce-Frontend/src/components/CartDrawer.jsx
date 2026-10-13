import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { PLACEHOLDER_IMAGE, handleImageError } from "../utils/placeholder";

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  subtotal,
  onCheckout,
}) {
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleIncrease = (item) => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    onCheckout();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={onClose}
        />
      )}

      {/* Cart Drawer */}
      <aside
        className={`cart-drawer ${
          isOpen ? "cart-drawer-open" : ""
        }`}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size={24} />

            <div>
              <h2>Shopping Cart</h2>

              <span>
                {cart.length}{" "}
                {cart.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="cart-close-button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={60} />

            <h3>Your cart is empty</h3>

            <p>
              Add some products to your cart and they
              will appear here.
            </p>

            <button
              type="button"
              className="continue-shopping-button"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  {/* Product Image */}
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="cart-item-image"
                    onError={handleImageError}
                  />

                  {/* Product Information */}
                  <div className="cart-item-info">
                    <span className="cart-item-category">
                      {item.category}
                    </span>

                    <h3 className="cart-item-name">
                      {item.name}
                    </h3>

                    <strong className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </strong>

                    {/* Quantity Controls */}
                    <div className="cart-item-bottom">
                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecrease(item)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleIncrease(item)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <strong className="cart-item-total">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Remove Product */}
                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() =>
                      onRemove(item.id)
                    }
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="cart-footer">
              {/* Clear Cart */}
              <div className="cart-footer-top">
                <button
                  type="button"
                  className="clear-cart-button"
                  onClick={onClearCart}
                >
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>

              {/* Price Summary */}
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal</span>

                  <strong>
                    ${subtotal.toFixed(2)}
                  </strong>
                </div>

                <div className="cart-summary-row">
                  <span>Shipping</span>

                  <strong>
                    ${shipping.toFixed(2)}
                  </strong>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-total">
                  <span>Total</span>

                  <strong>
                    ${total.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Checkout */}
              <button
                type="button"
                className="checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                className="continue-shopping-button cart-continue-button"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;