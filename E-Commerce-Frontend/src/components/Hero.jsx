import { ShieldCheck, Truck, Star, Flame } from "lucide-react";

// Photos (same Unsplash images used by the product cards, so they are known to load)
const HERO_MAIN =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80";
const HERO_ONE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
const HERO_TWO =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";

// If a photo can't load, hide it and let the gradient behind it show
// instead of a broken-image icon.
const hideBrokenImage = (e) => {
  e.currentTarget.style.display = "none";
};

function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="hero-section" id="home">
      {/* decorative glow blobs */}
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />

      <div className="hero">
        {/* ================= TEXT ================= */}
        <div className="hero-content">
          <p className="hero-tag">
            <span className="hero-tag-dot" />
            NEW COLLECTION 2026
          </p>

          <h1>
            Discover Products
            <br />
            <span className="hero-highlight">You’ll Love.</span>
          </h1>

          <p className="hero-description">
            Explore our latest collection of quality products,
            exclusive deals, and everyday essentials — delivered
            to your door.
          </p>

          <div className="hero-buttons">
            <button className="shop-now-btn" onClick={scrollToProducts}>
              Shop Now →
            </button>

            <button className="explore-btn" onClick={scrollToCategories}>
              Explore Categories
            </button>
          </div>

          <div className="hero-features">
            <div>
              <strong>10K+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>50K+</strong>
              <span>Happy Customers</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </div>

        {/* ================= IMAGES ================= */}
        <div className="hero-visual">
          <div className="hero-glow" aria-hidden="true" />

          <div className="hero-main-img">
            <img
              src={HERO_MAIN}
              alt="Featured premium sneakers"
              onError={hideBrokenImage}
            />
          </div>

          <div className="hero-sub-img hero-sub-one">
            <img
              src={HERO_ONE}
              alt="Wireless headphones"
              onError={hideBrokenImage}
            />
          </div>

          <div className="hero-sub-img hero-sub-two">
            <img
              src={HERO_TWO}
              alt="Smart watch"
              onError={hideBrokenImage}
            />
          </div>

          <div className="hero-float hero-float-a">
            <span className="hero-float-icon hero-float-fire">
              <Flame size={20} />
            </span>
            <div>
              <strong>Hot Deals</strong>
              <small>Up to 50% OFF</small>
            </div>
          </div>

          <div className="hero-float hero-float-b">
            <span className="hero-float-icon hero-float-star">
              <Star size={20} fill="currentColor" />
            </span>
            <div>
              <strong>4.9 / 5 Rating</strong>
              <small>From 50K+ reviews</small>
            </div>
          </div>
        </div>
      </div>

      {/* trust strip */}
      <div className="hero-trust">
        <div>
          <Truck size={20} />
          <span>Fast &amp; free shipping</span>
        </div>
        <div>
          <ShieldCheck size={20} />
          <span>Secure checkout</span>
        </div>
        <div>
          <Star size={20} />
          <span>Quality guaranteed</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;