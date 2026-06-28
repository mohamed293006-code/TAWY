import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { updateOrderStatus } from "../../services/orderService.js";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            تفاصيل الطلب #{order?.orderNumber || order?.id}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900 mb-1">بيانات العميل</p>
            <p className="text-gray-600">الاسم: {order?.customer?.fullName || "—"}</p>
            <p className="text-gray-600">الهاتف: {order?.customer?.phone || "—"}</p>
            <p className="text-gray-600">المدينة: {order?.customer?.city || "—"}</p>
            <p className="text-gray-600">العنوان: {order?.customer?.address || "—"}</p>
            {order?.customer?.notes && (
              <p className="text-gray-600">ملاحظات: {order.customer.notes}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-gray-900 mb-1">المنتجات</p>
            <div className="flex flex-col gap-2">
              {order?.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span>{item?.name} × {item?.quantity}</span>
                  <span>{(item?.price || 0) * (item?.quantity || 0)} ج.م</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold text-gray-900">
            <span>الإجمالي</span>
            <span>{order?.totalPrice} ج.م</span>
          </div>

          <p className="text-gray-500 text-xs">
            الحالة الحالية: {STATUS_LABELS[order?.status] || order?.status}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const items = snapshot?.docs?.map((docSnap) => ({
        id: docSnap?.id,
        ...docSnap?.data(),
      })) || [];

      setOrders(items);
    } catch (err) {
      console.error("OrdersManager: fetch error ->", err);
      setError("حدث خطأ أثناء جلب الطلبات.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("OrdersManager: status update error ->", err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {loading ? (
        <p className="text-sm text-gray-500">جاري تحميل الطلبات...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : orders?.length === 0 ? (
        <p className="text-sm text-gray-500">لا توجد طلبات.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">رقم الطلب</th>
                <th className="px-4 py-3 font-medium text-gray-700">الاسم</th>
                <th className="px-4 py-3 font-medium text-gray-700">الهاتف</th>
                <th className="px-4 py-3 font-medium text-gray-700">الإجمالي</th>
                <th className="px-4 py-3 font-medium text-gray-700">الحالة</th>
                <th className="px-4 py-3 font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order?.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900">
                    {order?.orderNumber || order?.id}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {order?.customer?.fullName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {order?.customer?.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {order?.totalPrice != null ? `${order.totalPrice} ج.م` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order?.status || "pending"}
                      disabled={updatingId === order?.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs font-medium text-gray-700 hover:text-gray-900 underline"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

export default OrdersManager;