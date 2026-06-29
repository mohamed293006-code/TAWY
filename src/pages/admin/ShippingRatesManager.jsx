import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2, Plus } from "lucide-react";
import {
  getAllShippingRates,
  addShippingRate,
  updateShippingRate,
  toggleShippingRateAvailability,
  deleteShippingRate,
} from "../../services/shippingService.js";

function ShippingRatesManager() {
  const navigate = useNavigate();

  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newGovernorate, setNewGovernorate] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  async function fetchRates() {
    try {
      const items = await getAllShippingRates();
      setRates(items);
    } catch (err) {
      console.error("ShippingRatesManager: fetch error ->", err);
      setError("حدث خطأ أثناء جلب بيانات الشحن.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRate(e) {
    e.preventDefault();
    if (!newGovernorate.trim() || !newPrice) return;

    setIsAdding(true);
    try {
      await addShippingRate({ governorate: newGovernorate.trim(), price: newPrice, available: true });
      setNewGovernorate("");
      setNewPrice("");
      await fetchRates();
    } catch (err) {
      console.error("ShippingRatesManager: add error ->", err);
      alert("حدث خطأ أثناء إضافة المحافظة.");
    } finally {
      setIsAdding(false);
    }
  }

  function startEdit(rate) {
    setEditingId(rate.id);
    setEditPrice(rate.price);
  }

  async function saveEdit(rate) {
    try {
      await updateShippingRate(rate.id, {
        governorate: rate.governorate,
        price: editPrice,
        available: rate.available !== false,
      });
      setEditingId(null);
      await fetchRates();
    } catch (err) {
      console.error("ShippingRatesManager: edit error ->", err);
      alert("حدث خطأ أثناء تعديل السعر.");
    }
  }

  async function handleToggleAvailability(rate) {
    try {
      await toggleShippingRateAvailability(rate.id, !(rate.available !== false));
      await fetchRates();
    } catch (err) {
      console.error("ShippingRatesManager: toggle error ->", err);
      alert("حدث خطأ أثناء تغيير حالة التوفر.");
    }
  }

  async function handleDelete(rateId) {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه المحافظة؟");
    if (!confirmed) return;

    try {
      await deleteShippingRate(rateId);
      await fetchRates();
    } catch (err) {
      console.error("ShippingRatesManager: delete error ->", err);
      alert("حدث خطأ أثناء الحذف.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowRight size={16} />
        الرجوع للوحة التحكم
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-6">إدارة الشحن والمحافظات</h1>

      <form onSubmit={handleAddRate} className="flex flex-wrap items-end gap-3 mb-8 bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">اسم المحافظة</label>
          <input
            type="text"
            value={newGovernorate}
            onChange={(e) => setNewGovernorate(e.target.value)}
            placeholder="مثال: القاهرة"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-48"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">سعر الشحن (ج.م)</label>
          <input
            type="number"
            min="0"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="50"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center gap-1 bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          <Plus size={16} />
          {isAdding ? "جاري الإضافة..." : "إضافة محافظة"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : rates.length === 0 ? (
        <p className="text-sm text-gray-500">لا توجد محافظات مضافة بعد.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">المحافظة</th>
                <th className="px-4 py-3 font-medium text-gray-700">سعر الشحن</th>
                <th className="px-4 py-3 font-medium text-gray-700">الحالة</th>
                <th className="px-4 py-3 font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{rate.governorate}</td>

                  <td className="px-4 py-3 text-gray-900">
                    {editingId === rate.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-24"
                      />
                    ) : (
                      `${rate.price} ج.م`
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleAvailability(rate)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        rate.available !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {rate.available !== false ? "متاح" : "غير متاح"}
                    </button>
                  </td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    {editingId === rate.id ? (
                      <button
                        onClick={() => saveEdit(rate)}
                        className="text-xs font-medium text-gray-900 underline"
                      >
                        حفظ
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(rate)}
                        className="text-xs font-medium text-gray-700 underline"
                      >
                        تعديل السعر
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(rate.id)}
                      className="text-gray-400 hover:text-red-600"
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShippingRatesManager;