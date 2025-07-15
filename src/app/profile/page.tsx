"use client";

import { useUserStore } from "@/lib/userStore";
import PrivateRoute from "@/components/PrivateRoute";

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <PrivateRoute>
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-black mb-8">회원정보</h1>

        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-green-700 text-lg font-bold mb-4">
                ✅ 회원 정보
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600 font-medium">이메일</span>
                <span className="text-black font-semibold">{user?.email}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600 font-medium">사용자 ID</span>
                <span className="text-black font-mono text-sm">{user?.id}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600 font-medium">가입일</span>
                <span className="text-black">
                  {user?.created_at &&
                    new Date(user.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">마지막 로그인</span>
                <span className="text-black">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString("ko-KR")
                    : "정보 없음"}
                </span>
              </div>
            </div>

            <div className="text-center pt-6">
              <a
                href="/"
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md font-medium"
              >
                홈으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
