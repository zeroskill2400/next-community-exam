"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import { useUserData } from "@/lib/useUserData";

export default function Home() {
  const { user, isLoading } = useUserStore();
  const { getUserData } = useUserData();

  // 페이지 로드 시 사용자 상태 확인
  useEffect(() => {
    if (!user) {
      getUserData();
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Next.js 커뮤니티
          </h1>
          <p className="text-gray-600 text-lg">
            Next.js와 Supabase로 만든 커뮤니티 플랫폼
          </p>
        </div>

        {/* 사용자 정보 섹션 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-black mb-6">사용자 정보</h2>

            {isLoading ? (
              <div className="text-blue-600 text-lg font-medium">
                ⏳ 로딩 중...
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="text-green-700 text-lg font-bold">
                  ✅ 로그인된 사용자:
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-black">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-black">
                    <strong>ID:</strong> {user.id}
                  </p>
                </div>
                <div className="text-sm text-blue-600">
                  💾 localStorage에서 즉시 로드됨 (persist)
                </div>
              </div>
            ) : (
              <div className="text-gray-600 text-lg">
                로그인이 필요합니다.{" "}
                <a
                  href="/login"
                  className="text-blue-700 hover:text-blue-900 font-semibold"
                >
                  로그인하기
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 바로가기 섹션 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            바로가기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                상품 목록
              </h3>
              <p className="text-gray-600">다양한 Apple 제품을 둘러보세요</p>
            </a>

            <a
              href="/cart"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                장바구니
              </h3>
              <p className="text-gray-600">담아둔 상품들을 확인하세요</p>
            </a>

            <a
              href="/community"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                커뮤니티
              </h3>
              <p className="text-gray-600">다른 사용자들과 소통하세요</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
