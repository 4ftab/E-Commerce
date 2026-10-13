import { useState } from "react";
import {
  Mail,
  ArrowUp,
  CheckCircle,
  Heart,
  MessageCircle,
  HelpCircle,
  User,
  ShoppingCart,
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setSubscribed(true);
    setEmail("");
  };

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      {/* NEWSLETTER */}

      <div className="footer-newsletter">
        <div className="footer-newsletter-content">
          <div>
            <p className="section-label">
              STAY UPDATED
            </p>

            <h2>Get the Latest Deals</h2>

            <p>
              Subscribe to our newsletter and
              never miss new products, special
              offers, and exclusive deals.
            </p>
          </div>

          {!subscribed ? (
            <form
              className="newsletter-form"
              onSubmit={handleSubscribe}
            >
              <div className="newsletter-input-wrapper">
                <Mail size={19} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="newsletter-button"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="newsletter-success">
              <CheckCircle size={24} />

              <div>
                <strong>
                  Successfully Subscribed!
                </strong>

                <span>
                  Thank you for joining us.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER MAIN */}

      <div className="footer-main">
        <div className="footer-container">

          {/* BRAND */}

          <div className="footer-column footer-brand">
            <h2>AK-STORE</h2>

            <p>
              Your trusted destination for
              quality products, great prices,
              and an easy shopping experience.
            </p>

            <div className="footer-socials">
              <button
                type="button"
                aria-label="Social Media"
                onClick={() =>
                  alert(
                    "Our social media page is coming soon."
                  )
                }
              >
                <MessageCircle size={18} />
              </button>

              <button
                type="button"
                aria-label="Community"
                onClick={() =>
                  alert(
                    "Our community page is coming soon."
                  )
                }
              >
                <Heart size={18} />
              </button>

              <button
                type="button"
                aria-label="Help"
                onClick={() =>
                  alert(
                    "Our help center is coming soon."
                  )
                }
              >
                <HelpCircle size={18} />
              </button>

              <button
                type="button"
                aria-label="Contact"
                onClick={() =>
                  alert(
                    "Contact us at aftabahmed9124@gmail.com"
                  )
                }
              >
                <Mail size={18} />
              </button>
            </div>
          </div>

          {/* SHOP */}

          <div className="footer-column">
            <h3>Shop</h3>

            <button
              type="button"
              onClick={() =>
                scrollToSection("products")
              }
            >
              All Products
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("categories")
              }
            >
              Categories
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("products")
              }
            >
              Best Sellers
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("products")
              }
            >
              New Arrivals
            </button>
          </div>

          {/* CUSTOMER SERVICE */}

          <div className="footer-column">
            <h3>Customer Service</h3>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Contact support: aftabahmed9124@gmail.com"
                )
              }
            >
              Contact Us
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Returns are accepted within 30 days."
                )
              }
            >
              Returns
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Free shipping is available on orders over $100."
                )
              }
            >
              Shipping Information
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Frequently Asked Questions coming soon."
                )
              }
            >
              FAQ
            </button>
          </div>

          {/* ACCOUNT */}

          <div className="footer-column">
            <h3>Account</h3>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Open the Account button in the navbar."
                )
              }
            >
              <User
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />
              My Account
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Open My Orders from your Account."
                )
              }
            >
              My Orders
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Open the wishlist using the heart icon."
                )
              }
            >
              Wishlist
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Open the cart using the cart icon."
                )
              }
            >
              <ShoppingCart
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />
              Shopping Cart
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {new Date().getFullYear()} AK-STORE.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Privacy Policy coming soon."
                )
              }
            >
              Privacy Policy
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Terms and Conditions coming soon."
                )
              }
            >
              Terms & Conditions
            </button>
          </div>

          <button
            type="button"
            className="back-to-top"
            onClick={scrollToTop}
          >
            <ArrowUp size={18} />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;