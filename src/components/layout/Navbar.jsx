import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import CartDrawer from "../cart/CartDrawer.jsx";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-900">
            TAWY
          </Link>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-gray-900"
              aria-label="السلة"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {user?.uid ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user?.displayName || "User"}
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="hidden sm:inline">{user?.displayName || ""}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-gray-900"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogIn size={20} />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;