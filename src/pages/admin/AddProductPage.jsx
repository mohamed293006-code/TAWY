import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AddProductForm from "./AddProductForm.jsx";

function AddProductPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowRight size={16} />
        الرجوع للوحة التحكم
      </button>

      <div className="flex justify-center">
        <AddProductForm onProductAdded={() => navigate("/admin")} />
      </div>
    </div>
  );
}

export default AddProductPage;