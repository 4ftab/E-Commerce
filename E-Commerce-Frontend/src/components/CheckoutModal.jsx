import { useState } from "react";
import {
  X,
  CreditCard,
  Banknote,
  CheckCircle,
  ShoppingBag,
  Loader,
} from "lucide-react";

function CheckoutModal({
  isOpen,
  onClose,
  cart = [],
  subtotal = 0,
  onOrderComplete,
}) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");

  if (!isOpen) return null;

  const shipping = subtotal >= 100 ? 0 : 10;
  const total    = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all customer details.");
      return;
    }

    setLoading(true);

    try {
      // onOrderComplete calls the backend POST /orders
      const success = await onOrderComplete({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        paymentMethod,
      });

      if (success) {
        setOrderPlaced(true);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderPlaced(false);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPaymentMethod("card");
    setError("");
    onClose();
  };

  // ---- SUCCESS SCREEN ----
  if (orderPlaced) {
    return (
      <div className="checkout-overlay" onClick={handleClose}>
        <div
          className="checkout-modal checkout-success-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="checkout-close-button"
            onClick={handleClose}
            aria-label="Close checkout"
          >
            <X size={24} />
          </button>

          <div className="checkout-success">
            <CheckCircle size={80} />
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your purchase. Your order has been successfully
              placed and saved to your account.
            </p>

            <div className="checkout-success-info">
              <ShoppingBag size={20} />
              <span>
                Total Paid: <strong>${total.toFixed(2)}</strong>
              </span>
            </div>

            <button
              type="button"
              className="checkout-success-button"
              onClick={handleClose}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- CHECKOUT FORM ----
  return (
    <div className="checkout-overlay" onClick={handleClose}>
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="checkout-header">
          <div>
            <p className="section-label">CHECKOUT</p>
            <h2>Complete Your Order</h2>
            <p>Enter your information to place your order.</p>
          </div>

          <button
            type="button"
            className="checkout-close-button"
            onClick={handleClose}
            aria-label="Close checkout"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              margin: "0 30px 10px",
              fontSize: "13px",
            }}
          >
            {error}
          </p>
        )}

        <div className="checkout-content">
          {/* Customer Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Customer Information</h3>

            <div className="checkout-input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="checkout-input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="checkout-input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
              />
            </div>

            <div className="checkout-input-group">
              <label>Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                rows="4"
              />
            </div>

            {/* Payment */}
            <h3>Payment Method</h3>

            <div className="payment-methods">
              <label
                className={`payment-option ${
                  paymentMethod === "card" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <CreditCard size={20} />
                <div>
                  <strong>Card Payment</strong>
                  <span>Pay using your card</span>
                </div>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "cod" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <Banknote size={20} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading ? (
                <Loader size={16} />
              ) : (
                `Place Order — $${total.toFixed(2)}`
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>

            <div className="checkout-products">
              {cart.map((item) => (
                <div className="checkout-product" key={item.cartItemId || item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="checkout-price-summary">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</strong>
              </div>
              <div className="checkout-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
