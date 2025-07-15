"use client";

import { useUserStore } from "@/lib/userStore";
import { useUserData } from "@/lib/useUserData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isLoading } = useUserStore();
  const { getUserData } = useUserData();
  const router = useRouter();
  const [isInitialCheck, setIsInitialCheck] = useState(true); // 초기 체크 상태

  // 페이지 로드 시 사용자 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        // persist 데이터가 없으면 실제 인증 상태 확인
        await getUserData();
      }
      // 초기 체크 완료
      setIsInitialCheck(false);
    };

    checkUser();
  }, []);

  // 초기 체크가 끝나고 로딩도 끝났는데 user가 없으면 로그인 페이지로
  useEffect(() => {
    if (!isInitialCheck && !isLoading && !user) {
      router.push("/login");
    }
  }, [isInitialCheck, isLoading, user, router]);

  // 초기 체크 중이거나 로딩 중이거나 user가 없을 때
  if (isInitialCheck || isLoading || !user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-blue-600 text-lg font-medium">⏳ 로딩 중...</div>
      </div>
    );
  }

  return (
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
              <span className="text-black font-semibold">{user.email}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">사용자 ID</span>
              <span className="text-black font-mono text-sm">{user.id}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">가입일</span>
              <span className="text-black">
                {new Date(user.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 font-medium">마지막 로그인</span>
              <span className="text-black">
                {user.last_sign_in_at
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
  );
}
