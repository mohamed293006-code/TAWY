import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import { getAllProducts, deleteProduct } from "../../services/productService.js";

function ProductsManager() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const items = await getAllProducts();
      setProducts(items);
    } catch (err) {
      console.error("ProductsManager: fetch error ->", err);
      setError("حدث خطأ أثناء جلب المنتجات.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmed) return;

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("ProductsManager: delete error ->", err);
      alert("حدث خطأ أثناء حذف المنتج.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowRight size={16} />
        الرجوع للوحة التحكم
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-6">إدارة المنتجات</h1>

      {loading ? (
        <p className="text-sm text-gray-500">جاري تحميل المنتجات...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">لا توجد منتجات.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square w-full bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full hover:bg-red-50 disabled:opacity-50"
                  aria-label="حذف المنتج"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">{product.price} ج.م</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsManager;