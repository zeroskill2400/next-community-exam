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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 히어로 섹션 */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Next.js 커뮤니티
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            최신 기술로 구현된 쇼핑몰과 커뮤니티 플랫폼에서 다양한 제품을
            만나보고 소통해보세요
          </p>

          {/* 사용자 상태 표시 */}
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-md">
            {isLoading ? (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                로딩 중...
              </div>
            ) : user ? (
              <div className="flex items-center text-green-700">
                <span className="font-medium text-black">{user.email}</span>
                <span className="ml-2 text-sm text-gray-600">
                  님 환영합니다
                </span>
              </div>
            ) : (
              <div className="text-gray-700">
                <span className="mr-2">👋</span>
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  로그인하기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 주요 기능 섹션 */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            주요 서비스
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 상품 쇼핑 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🛍️</span>
              </div>
              <h3 className="text-xl font-bold text-black text-center mb-4">
                상품 쇼핑
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                최신 Apple 제품들을 둘러보고 원하는 상품을 장바구니에 담아보세요
              </p>
              <a
                href="/products"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                상품 보러가기
              </a>
            </div>

            {/* 장바구니 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-black text-center mb-4">
                장바구니
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                담아둔 상품들을 확인하고 주문을 완료해보세요
              </p>
              <a
                href="/cart"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                장바구니 확인
              </a>
            </div>

            {/* 커뮤니티 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-black text-center mb-4">
                커뮤니티
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                다른 사용자들과 소통하고 정보를 공유해보세요
              </p>
              <a
                href="/community"
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                커뮤니티 참여
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 특징 소개 섹션 */}
      <div className="w-full bg-white py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-12">
              왜 우리 플랫폼을 선택해야 할까요?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  빠른 성능
                </h3>
                <p className="text-gray-600">
                  Next.js와 Supabase로 구현된 최적화된 성능
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  안전한 보안
                </h3>
                <p className="text-gray-600">
                  안전한 사용자 인증과 데이터 보호
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  반응형 디자인
                </h3>
                <p className="text-gray-600">
                  모든 기기에서 완벽한 사용자 경험
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
