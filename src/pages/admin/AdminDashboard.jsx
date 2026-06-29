import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import OrdersManager from "./OrdersManager.jsx";

function AdminDashboard() {
  const { profile } = useAuth();
  const location = useLocation();

  const tabs = [
    { label: "الطلبات", path: "/admin" },
    { label: "المنتجات", path: "/admin/products" },
    { label: "إضافة منتج", path: "/admin/add-product" },
    { label: "إدارة الشحن", path: "/admin/shipping" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">لوحة التحكم</h1>
      <p className="text-sm text-gray-500 mb-6">
        مرحباً {profile?.displayName || "أدمن"}
      </p>

      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              location.pathname === tab.path
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <OrdersManager />
    </div>
  );
}

export default AdminDashboard;