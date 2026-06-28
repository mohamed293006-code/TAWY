import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { addProductWithImages } from "../../services/productService.js";

function AddProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removeImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setForm({ title: "", description: "", price: "", category: "" });
    setImageFiles([]);
    setPreviews([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

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
      const productId = await addProductWithImages(form, imageFiles);
      setSuccessMessage("تم إضافة المنتج بنجاح.");
      resetForm();
      onProductAdded?.(productId);
    } catch (err) {
      console.error("AddProductForm: submit error ->", err);
      setError(err?.message || "حدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        إضافة منتج جديد
      </h2>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 mb-4">
          {successMessage}
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
            placeholder="مثال: تيشيرت قطن أساسي"
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
            placeholder="وصف مختصر للمنتج..."
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
              placeholder="0.00"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">القسم</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="مثال: ملابس"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">صور المنتج</label>

          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md py-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <ImagePlus size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">اختر صوراً (يمكن اختيار أكثر من صورة)</span>
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
                  <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
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
          {isSubmitting ? "جاري الرفع..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;