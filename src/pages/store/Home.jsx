import React, { useState, useEffect, useMemo } from "react";
import { getAllProducts } from "../../services/productService.js";
import ProductCard from "../../components/product/ProductCard.jsx";
import SearchBar from "../../components/search/SearchBar.jsx";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const items = await getAllProducts();
        setProducts(items);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("حدث خطأ أثناء جلب المنتجات.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">جاري تحميل المنتجات...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">لا توجد منتجات مطابقة.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;