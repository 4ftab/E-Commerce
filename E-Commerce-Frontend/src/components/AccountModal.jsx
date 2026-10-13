import { useState } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  LogOut,
  Package,
  Loader,
} from "lucide-react";
import { registerUser, loginUser as apiLogin, createCart } from "../api";

function AccountModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onOrderHistory,
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const name     = formData.get("name")?.trim()     || "";
    const email    = formData.get("email")?.trim()    || "";
    const password = formData.get("password")?.trim() || "";

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (isRegisterMode && !name) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        // ---- REGISTER ----
        const regResult = await registerUser(name, email, password);

        if (!regResult.userId) {
          setError(regResult.message || "Registration failed.");
          setLoading(false);
          return;
        }

        // Auto-login after register
        const loginResult = await apiLogin(email, password);

        if (!loginResult.token) {
          setError(loginResult.message || "Login after registration failed.");
          setLoading(false);
          return;
        }

        localStorage.setItem("AK-STORE-token", loginResult.token);

        const loggedInUser = { name, email };
        onLogin(loggedInUser);

        // Create a cart for the new user
        await createCart().catch(() => {});

        e.target.reset();
        onClose();

      } else {
        // ---- LOGIN ----
        const loginResult = await apiLogin(email, password);

        if (!loginResult.token) {
          setError(loginResult.message || "Invalid email or password.");
          setLoading(false);
          return;
        }

        localStorage.setItem("AK-STORE-token", loginResult.token);

        // Derive name from email if not in response
        const loggedInUser = {
          name: loginResult.name || email.split("@")[0],
          email,
        };
        onLogin(loggedInUser);

        // Ensure the user has a cart (silently ignore if one already exists)
        await createCart().catch(() => {});

        e.target.reset();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const handleOrderHistory = () => {
    onClose();
    if (onOrderHistory) onOrderHistory();
  };

  return (
    <div
      className="account-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="account-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          maxWidth: "90%",
          background: "white",
          color: "black",
          padding: "30px",
          borderRadius: "15px",
          position: "relative",
          zIndex: 100000,
        }}
      >
        <button
          type="button"
          className="account-close-button"
          onClick={onClose}
          aria-label="Close account"
        >
          <X size={24} />
        </button>

        {user ? (
          /* ---- LOGGED IN VIEW ---- */
          <div className="account-logged-in">
            <div className="account-avatar">
              <User size={35} />
            </div>

            <h2>Welcome, {user.name}</h2>
            <p>{user.email}</p>

            <div className="account-info">
              <div>
                <span>Account Status</span>
                <strong>Active</strong>
              </div>
              <div>
                <span>Wishlist Items</span>
                <strong>Available</strong>
              </div>
              <div>
                <span>Orders</span>
                <strong>View Orders</strong>
              </div>
            </div>

            <button
              type="button"
              className="account-orders-button"
              onClick={handleOrderHistory}
            >
              <Package size={18} />
              My Orders
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          /* ---- LOGIN / REGISTER FORM ---- */
          <div className="account-header">
            <div className="account-icon">
              <User size={28} />
            </div>

            <h2>Welcome to AK-Store</h2>
            <p>
              {isRegisterMode
                ? "Create a new account to continue."
                : "Login to your account to continue."}
            </p>

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <form className="account-form" onSubmit={handleSubmit}>
              {isRegisterMode && (
                <div className="account-input-group">
                  <label>
                    <User size={17} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="account-input-group">
                <label>
                  <Mail size={17} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="account-input-group">
                <label>
                  <Lock size={17} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="account-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <Loader size={16} />
                ) : isRegisterMode ? (
                  "Create Account"
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                marginTop: "14px",
                fontSize: "13px",
              }}
            >
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setError(""); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e44d26",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: 0,
                    }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setError(""); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e44d26",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: 0,
                    }}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountModal;
