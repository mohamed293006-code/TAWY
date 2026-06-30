import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { updateProductWithImages } from "../../services/productService.js";
import { STORE_CATEGORIES } from "../../constants/categories.js";

function EditProductForm({ product, onClose, onProductUpdated }) {
  const [form, setForm] = useState({
    title: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    category: product?.category || STORE_CATEGORIES[0],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removeNewImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("اسم المنتج مطلوب.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("يرجى إدخال سعر صحيح للمنتج.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProductWithImages(product.id, form, imageFiles);
      onProductUpdated?.();
      onClose();
    } catch (err) {
      console.error("EditProductForm: submit error ->", err);
      setError(err?.message || "حدث خطأ أثناء تعديل المنتج.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const existingImages = product?.images?.length ? product.images : [product?.mainImage || product?.image].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">تعديل المنتج</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">اسم المنتج</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">الوصف</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">السعر (ج.م)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">القسم</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {STORE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">الصور الحالية</label>
            <div className="grid grid-cols-4 gap-2">
              {existingImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-md overflow-hidden border border-gray-200">
                  <img src={img} alt={`current-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              استبدال الصور <span className="text-xs text-gray-400">(اختياري — اترك فارغاً للإبقاء على الصور الحالية)</span>
            </label>

            <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md py-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <ImagePlus size={20} className="text-gray-400" />
              <span className="text-xs text-gray-500">اختر صوراً جديدة لاستبدال الصور الحالية</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
              />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                    <img src={src} alt={`new-preview-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gray-900 text-white text-sm py-2.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;