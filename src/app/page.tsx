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
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-black mb-8">Hello World</h1>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-6">사용자 정보</h2>

        {isLoading ? (
          <div className="text-blue-600 text-lg font-medium">⏳ 로딩 중...</div>
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
  );
}
