import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  const displayImage = product.mainImage || product.image || product.images?.[0];

  return (
    <Link
      to={`/product/${product.id}`}
      className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <span className="text-base font-semibold text-gray-900">
          {product.price} ج.م
        </span>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-gray-900 text-white text-sm py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          إضافة للسلة
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;