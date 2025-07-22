"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userStore";
import { useCartStore } from "@/lib/cartStore";
import { supabase } from "@/lib/supabaseClient";

export default function Navigation() {
  const { user, clearUser } = useUserStore();
  const { totalItems } = useCartStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Supabase 로그아웃
      await supabase.auth.signOut();

      // Zustand 상태 초기화
      clearUser();

      // 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 네비게이션 링크 클릭 핸들러
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="flex space-x-4">
      <button
        onClick={() => handleNavigation("/")}
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        홈
      </button>

      <button
        onClick={() => handleNavigation("/posts")}
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        커뮤니티
      </button>

      <button
        onClick={() => handleNavigation("/products")}
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        상품목록
      </button>

      <button
        onClick={() => handleNavigation("/cart")}
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium relative transition-colors"
      >
        장바구니
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {user ? (
        // 로그인 상태
        <>
          <button
            onClick={() => handleNavigation("/profile")}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            회원정보
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            로그아웃
          </button>
        </>
      ) : (
        // 비로그인 상태
        <>
          <button
            onClick={() => handleNavigation("/signup")}
            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            회원가입
          </button>
          <button
            onClick={() => handleNavigation("/login")}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            로그인
          </button>
        </>
      )}
    </nav>
  );
}
