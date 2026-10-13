import { X, Package, ShoppingBag } from "lucide-react";

function OrderHistoryModal({ isOpen, onClose, orders = [] }) {
  if (!isOpen) return null;

  return (
    <div
      className="order-history-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="order-history-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          maxWidth: "95%",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "white",
          color: "black",
          borderRadius: "15px",
          padding: "30px",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order history"
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Package size={28} />
          <h2 style={{ margin: 0 }}>My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            <ShoppingBag size={50} style={{ marginBottom: "12px", opacity: 0.4 }} />
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p style={{ margin: "2px 0", fontSize: "13px", color: "#666" }}>
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        background: "#e6f4ea",
                        color: "#2e7d32",
                        borderRadius: "20px",
                        padding: "3px 12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status || "Completed"}
                    </span>
                    <p style={{ margin: "4px 0 0", fontWeight: "bold" }}>
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div
                    style={{
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          color: "#444",
                        }}
                      >
                        <span>
                          {item.name}{" "}
                          <span style={{ color: "#999" }}>× {item.quantity}</span>
                        </span>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryModal;
