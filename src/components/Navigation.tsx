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

  return (
    <nav className="flex space-x-4">
      <a
        href="/"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        홈
      </a>

      <a
        href="/products"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        상품목록
      </a>

      <a
        href="/cart"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium relative"
      >
        장바구니
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </a>

      {user ? (
        // 로그인 상태
        <>
          <a
            href="/profile"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            회원정보
          </a>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            로그아웃
          </button>
        </>
      ) : (
        // 비로그인 상태
        <>
          <a
            href="/signup"
            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            회원가입
          </a>
          <a
            href="/login"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            로그인
          </a>
        </>
      )}
    </nav>
  );
}
