"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUserData } from "../lib/useUserData";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { getUserData } = useUserData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setEmail("");
        setPassword("");

        // 로그인 성공 후 사용자 데이터 조회
        console.log("🎉 로그인 성공! 사용자 데이터 조회 시작...");
        const userData = await getUserData();

        if (userData.success) {
          console.log("🔥 최종 사용자 정보:", userData.user);
        } else {
          console.error("⚠️ 사용자 데이터 조회 실패:", userData.error);
        }
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            로그인 성공!
          </h2>
          <p className="text-gray-800 text-base mb-4">
            성공적으로 로그인되었습니다.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-blue-700 hover:text-blue-900 font-semibold"
          >
            다시 로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-base font-semibold text-gray-900 mb-2"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 text-gray-900"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-base font-semibold text-gray-900 mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 text-gray-900"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        {error && (
          <div className="text-red-800 text-base font-medium bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-base"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-base text-gray-800">
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-blue-700 hover:text-blue-900 font-semibold"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
