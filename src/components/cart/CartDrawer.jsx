import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";

function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    shippingGovernorate,
    shippingCost,
    grandTotal,
  } = useCart();
  const navigate = useNavigate();

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">السلة</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-14rem)] overflow-y-auto px-4 py-4 gap-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-10">
              السلة فارغة.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-gray-100 pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">{item.price} ج.م</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  aria-label="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 px-4 py-4 bg-white">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>سعر المنتجات</span>
            <span>{totalPrice} ج.م</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              مصاريف الشحن{shippingGovernorate ? ` لـ ${shippingGovernorate}` : ""}
            </span>
            <span>
              {shippingGovernorate ? `${shippingCost} ج.م` : "يُحدد في صفحة الطلب"}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">الإجمالي</span>
            <span className="text-base font-bold text-gray-900">
              {grandTotal} ج.م
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            إتمام الطلب
          </button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;