import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createOrder } from "../../services/orderService.js";

function Checkout() {
  const { cart, totalPrice, clearCart, isCartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("السلة فارغة.");
      return;
    }

    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    if (!form.email || !isValidEmail(form.email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح لاستلام تأكيد الطلب.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        customer: form,
        items: cart,
        totalPrice,
      });

      clearCart();
      navigate("/order-success", { state: { orderId } });
    } catch (err) {
      console.error("Order creation error:", err);
      setError("حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isButtonDisabled = isCartLoading || isSubmitting || cart.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          بيانات الشحن
        </h2>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="الاسم الكامل"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="رقم الهاتف"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="المدينة"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="العنوان بالتفصيل"
            rows={3}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="ملاحظات (اختياري)"
            rows={2}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700">
            طريقة الدفع: الدفع عند الاستلام
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="bg-gray-900 text-white text-sm py-2.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isCartLoading
              ? "جاري تحميل السلة..."
              : isSubmitting
              ? "جاري تأكيد الطلب..."
              : "تأكيد الطلب"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ملخص الطلب
        </h2>

        {isCartLoading ? (
          <p className="text-sm text-gray-500">جاري تحميل السلة...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      الكمية: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.price * item.quantity} ج.م
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-900">
            الإجمالي
          </span>
          <span className="text-base font-bold text-gray-900">
            {totalPrice} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;