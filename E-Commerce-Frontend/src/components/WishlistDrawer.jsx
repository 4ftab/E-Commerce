import {
  X,
  ShoppingCart,
  Trash2,
  Heart,
} from "lucide-react";

function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemove,
  onAddToCart,
}) {
  return (
    <>
      {/* =========================
          OVERLAY
      ========================== */}

      {isOpen && (
        <div
          className="wishlist-overlay"
          onClick={onClose}
        />
      )}


      {/* =========================
          DRAWER
      ========================== */}

      <aside
        className={`wishlist-drawer ${
          isOpen
            ? "wishlist-drawer-open"
            : ""
        }`}
      >

        {/* =========================
            HEADER
        ========================== */}

        <div className="wishlist-header">

          <div>

            <h2>
              My Wishlist
            </h2>

            <span>
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "item"
                : "items"}
            </span>

          </div>


          <button
            className="wishlist-close-button"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            <X size={24} />
          </button>

        </div>


        {/* =========================
            EMPTY WISHLIST
        ========================== */}

        {wishlist.length === 0 ? (

          <div className="empty-wishlist">

            <Heart size={55} />

            <h3>
              Your wishlist is empty
            </h3>

            <p>
              Save products you love and
              find them here later.
            </p>

            <button
              className="continue-shopping-button"
              onClick={onClose}
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          /* =========================
             WISHLIST ITEMS
          ========================== */

          <div className="wishlist-items">

            {wishlist.map((product) => (

              <div
                className="wishlist-item"
                key={product.id}
              >

                {/* IMAGE */}

                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-item-image"
                />


                {/* INFORMATION */}

                <div className="wishlist-item-info">

                  <p className="wishlist-item-category">
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <strong>
                    ${product.price.toFixed(2)}
                  </strong>


                  {/* ADD TO CART */}

                  <button
                    className="wishlist-cart-button"
                    onClick={() => {
                      onAddToCart(product);
                    }}
                  >

                    <ShoppingCart size={16} />

                    Add to Cart

                  </button>

                </div>


                {/* REMOVE */}

                <button
                  className="wishlist-remove-button"
                  onClick={() =>
                    onRemove(product.id)
                  }
                  aria-label="Remove from wishlist"
                >

                  <Trash2 size={18} />

                </button>

              </div>

            ))}

          </div>

        )}

      </aside>
    </>
  );
}

export default WishlistDrawer;