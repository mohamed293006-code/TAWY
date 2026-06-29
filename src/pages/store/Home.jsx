import React, { useState, useEffect, useMemo } from "react";
import { getAllProducts } from "../../services/productService.js";
import ProductCard from "../../components/product/ProductCard.jsx";
import SearchBar from "../../components/search/SearchBar.jsx";
import HeroCarousel from "../../components/store/HeroCarousel.jsx";

const MAX_HERO_SLIDES = 5;

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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

  const heroSlides = useMemo(() => {
    const activeProducts = products.filter((p) => p.isActive !== false && (p.image || p.images?.length));
    const featured = activeProducts.filter((p) => p.featured === true);
    const source = featured.length > 0 ? featured : activeProducts;
    return source.slice(0, MAX_HERO_SLIDES);
  }, [products]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(unique);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;
    if (min !== null) {
      result = result.filter((product) => Number(product.price) >= min);
    }
    if (max !== null) {
      result = result.filter((product) => Number(product.price) <= max);
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOrder, minPrice, maxPrice]);

  return (
    <div>
      {!loading && heroSlides.length > 0 && (
        <HeroCarousel slides={heroSlides} />
      )}

      <div id="products" className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 border border-gray-200 rounded-md p-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="all">كل الأقسام</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="asc">السعر: من الأقل للأعلى</option>
            <option value="desc">السعر: من الأعلى للأقل</option>
          </select>

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="أقل سعر"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="أعلى سعر"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
          />
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
    </div>
  );
}

export default Home;