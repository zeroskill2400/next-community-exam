"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userStore";
import Link from "next/link";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useUserStore();

  // 로그인하지 않은 경우 리다이렉트
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-blue-500 text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-700 mb-6">
              게시글을 작성하려면 먼저 로그인해주세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/posts"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    if (title.trim().length < 3) {
      setError("제목은 3글자 이상 입력해주세요.");
      return;
    }

    if (content.trim().length < 10) {
      setError("내용은 10글자 이상 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author_id: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 성공시 목록으로 이동
        router.push("/posts");
      } else {
        setError(data.error || "게시글 작성에 실패했습니다.");
      }
    } catch (err) {
      setError("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("게시글 작성 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/posts"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 목록으로
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-black">새 글 작성</h1>
                <p className="text-gray-700 text-sm">
                  당신의 이야기를 들려주세요
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/posts")}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                form="post-form"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <form
            id="post-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border p-8"
          >
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* 작성자 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || "사용자"}
                  </p>
                  <p className="text-xs text-gray-600">작성자</p>
                </div>
              </div>
            </div>

            {/* 제목 입력 */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900 mb-3"
              >
                제목 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder-gray-500"
                placeholder="어떤 이야기를 들려주실 건가요?"
                required
                disabled={loading}
                maxLength={100}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">
                  최소 3글자 이상 입력해주세요
                </p>
                <p className="text-xs text-gray-500">{title.length}/100</p>
              </div>
            </div>

            {/* 내용 입력 */}
            <div className="mb-8">
              <label
                htmlFor="content"
                className="block text-sm font-bold text-gray-900 mb-3"
              >
                내용 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 leading-relaxed resize-none placeholder-gray-500"
                placeholder="자유롭게 당신의 생각을 표현해보세요. 
                
다른 사람들과 나누고 싶은 이야기, 경험, 질문 등 무엇이든 좋습니다.

정중하고 건설적인 소통을 위해 예의를 지켜주세요."
                required
                disabled={loading}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">
                  최소 10글자 이상 입력해주세요
                </p>
                <p className="text-xs text-gray-500">{content.length}글자</p>
              </div>
            </div>

            {/* 작성 팁 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                ✨ 좋은 게시글 작성 팁
              </h3>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 명확하고 구체적인 제목을 작성해주세요</li>
                <li>• 다른 사람이 이해하기 쉽게 설명해주세요</li>
                <li>• 정중하고 존중하는 언어를 사용해주세요</li>
                <li>• 개인정보나 민감한 정보는 포함하지 마세요</li>
              </ul>
            </div>

            {/* 제출 버튼들 (모바일용) */}
            <div className="flex gap-3 sm:hidden">
              <button
                type="button"
                onClick={() => router.push("/posts")}
                className="flex-1 py-3 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
