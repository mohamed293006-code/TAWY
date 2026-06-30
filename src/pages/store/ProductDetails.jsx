import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/productService.js";
import { useCart } from "../../context/CartContext.jsx";

const WHATSAPP_NUMBER = "201553533261";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(id);
        if (!data) {
          setError("المنتج غير موجود.");
        } else {
          setProduct(data);
          setActiveImage(data.mainImage || data.images?.[0] || data.image || "");
        }
      } catch (err) {
        console.error("ProductDetails: fetch error ->", err);
        setError("حدث خطأ أثناء جلب بيانات المنتج.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  function handleOrderViaWhatsApp() {
    if (!product) return;

    const message = `أهلاً TAWY، أريد طلب منتج ${product.name} بسعر ${product.price} جنيه.
رابط المنتج: ${window.location.href}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-sm text-gray-500">جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <p className="text-sm text-red-600">{error || "المنتج غير موجود."}</p>
        <Link to="/" className="text-sm text-gray-700 underline">
          الرجوع للمتجر
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.mainImage || product.image].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← الرجوع للمتجر
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                لا توجد صورة
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    activeImage === img ? "border-gray-900" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${product.name}-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {product.category}
            </span>
          )}

          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <span className="text-xl font-semibold text-gray-900">
            {product.price} ج.م
          </span>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 text-white text-sm py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              إضافة للسلة
            </button>

            <button
              onClick={handleOrderViaWhatsApp}
              className="flex-1 bg-[#25D366] text-white text-sm py-3 rounded-md hover:bg-[#1ea952] transition-colors"
            >
              اطلب عبر الواتساب
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="collapse collapse-arrow border border-gray-200 rounded-md bg-white">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title text-sm font-medium text-gray-900">
                تفاصيل المنتج
              </div>
              <div className="collapse-content text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "لا يوجد وصف مفصل لهذا المنتج حالياً."}
              </div>
            </div>

            <div className="collapse collapse-arrow border border-gray-200 rounded-md bg-white">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium text-gray-900">
                معلومات الشحن
              </div>
              <div className="collapse-content text-sm text-gray-600 leading-relaxed">
                يتم شحن طلبك خلال 2-5 أيام عمل حسب المحافظة، مع إمكانية الدفع
                عند الاستلام. تختلف مصاريف الشحن حسب المحافظة وتظهر بوضوح أثناء
                إتمام الطلب.
              </div>
            </div>

            <div className="collapse collapse-arrow border border-gray-200 rounded-md bg-white">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium text-gray-900">
                سياسة الاسترجاع
              </div>
              <div className="collapse-content text-sm text-gray-600 leading-relaxed">
                يمكنك استرجاع أو استبدال المنتج خلال 14 يوماً من تاريخ الاستلام،
                بشرط أن يكون بحالته الأصلية وبدون استخدام. تواصل معنا عبر
                واتساب لتفاصيل الاسترجاع.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;