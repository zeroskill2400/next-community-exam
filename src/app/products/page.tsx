"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { Product } from "@/app/api/products/route";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { addItem } = useCartStore();

  const categories = [
    { value: "all", label: "전체" },
    { value: "laptop", label: "노트북" },
    { value: "phone", label: "스마트폰" },
    { value: "tablet", label: "태블릿" },
    { value: "audio", label: "오디오" },
    { value: "watch", label: "워치" },
    { value: "desktop", label: "데스크톱" },
  ];

  // 상품 데이터 가져오기
  const fetchProducts = async (category: string = "all") => {
    try {
      setLoading(true);
      setError(null);

      const url =
        category === "all"
          ? "/api/products"
          : `/api/products?category=${category}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "상품을 불러오는데 실패했습니다.");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("상품 로딩 오류:", error);
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 상품 데이터 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);

  // 카테고리 변경 시 상품 데이터 다시 가져오기
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  // 장바구니에 상품 추가
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image_url || "",
    });
    alert(`${product.name}이(가) 장바구니에 추가되었습니다!`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">상품을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
              <button
                onClick={() => fetchProducts(selectedCategory)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">상품 목록</h1>
          <p className="text-gray-600 text-lg">원하는 상품을 찾아보세요</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg">
                해당 카테고리에 상품이 없습니다.
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                총 {products.length}개의 상품
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* 상품 이미지 */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-6">
                      <div className="mb-2">
                        {product.category && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
                            {categories.find(
                              (cat) => cat.value === product.category
                            )?.label || product.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {product.price.toLocaleString()}원
                        </span>
                        <span className="text-sm text-gray-500">
                          재고: {product.stock_quantity}개
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          product.stock_quantity === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {product.stock_quantity === 0
                          ? "품절"
                          : "장바구니 담기"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
