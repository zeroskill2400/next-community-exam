"use client";

import { supabase } from "./supabaseClient";

export function useUserData() {
  const getUserData = async () => {
    try {
      console.log("🔍 사용자 데이터 조회 시작...");

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("❌ 사용자 데이터 조회 실패:", error.message);
        return { success: false, error: error.message };
      }

      console.log("✅ 사용자 데이터 조회 성공:", data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("💥 예외 발생:", error);
      return { success: false, error: "사용자 데이터 조회 중 오류 발생" };
    }
  };

  return { getUserData };
}
