"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      setError("비밀번호는 6자리 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            회원가입 완료!
          </h2>
          <p className="text-gray-800 text-base mb-4">
            이메일 주소로 확인 링크를 보내드렸습니다.
          </p>
          <p className="text-gray-800 text-base mb-4">
            이메일을 확인하고 계정을 활성화해주세요.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-blue-700 hover:text-blue-900 font-semibold"
          >
            다시 가입하기
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
            placeholder="6자리 이상 입력하세요"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-base font-semibold text-gray-900 mb-2"
          >
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 text-gray-900"
            placeholder="위와 동일한 비밀번호"
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
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-base text-gray-800">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-blue-700 hover:text-blue-900 font-semibold"
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
