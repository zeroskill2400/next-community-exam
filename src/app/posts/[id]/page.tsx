"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/userStore";

// 게시글 타입 정의 - TypeScript의 타입 안정성 활용
interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  users: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    avatar_url: string;
  } | null;
}

/**
 * Next.js 15+ 동적 라우팅 파라미터 타입
 *
 * 🔄 변화 이유:
 * - Next.js 15부터 params가 Promise 객체로 변경
 * - 서버 컴포넌트에서 비동기 처리 최적화를 위함
 * - 스트리밍과 서스펜스 경계에서 더 나은 성능 제공
 */
interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  /**
   * 🎯 React.use() 훅을 사용하는 이유:
   *
   * 1. Next.js 15 호환성:
   *    - params가 Promise로 변경되어 직접 접근 시 경고 발생
   *    - 미래 버전에서는 필수 요구사항이 될 예정
   *
   * 2. React.use()의 특징:
   *    - Promise와 Context를 처리할 수 있는 새로운 React 훅
   *    - 컴포넌트 내부에서 Promise를 동기적으로 처리
   *    - Suspense 경계와 함께 사용하여 로딩 상태 관리 최적화
   *
   * 3. 클라이언트 컴포넌트에서의 활용:
   *    - 서버에서 전달받은 Promise 매개변수를 안전하게 언래핑
   *    - 타입 안전성 보장 (TypeScript와 완벽 호환)
   *    - 에러 경계와 함께 사용하여 견고한 에러 처리
   */
  const resolvedParams = use(params);

  // 상태 관리 - React Hooks 패턴
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore(); // useUserStore에서 user 객체 가져오기

  // 컴포넌트 마운트 시 게시글 조회 - useEffect 패턴
  useEffect(() => {
    if (resolvedParams.id) {
      fetchPost(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  // 게시글 조회 함수 - Supabase JOIN 쿼리 활용
  const fetchPost = async (postId: string) => {
    try {
      console.log("Fetching post:", postId);

      // Supabase에서 posts와 users 테이블 JOIN 조회
      const { data, error: supabaseError } = await supabase
        .from("posts")
        .select(
          `
          *,
          users:author_id (
            id,
            email,
            name,
            nickname,
            avatar_url
          )
        `
        )
        .eq("id", postId) // WHERE 조건
        .single(); // 단일 결과 반환

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw supabaseError;
      }

      if (!data) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      console.log("Post fetched:", data);
      setPost(data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching post:", error);
      setError(error.message || "게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 작성자 이름 표시 우선순위 - 닉네임 > 이름 > 이메일
  const getAuthorName = (post: Post) => {
    if (!post.users) {
      return `사용자 ${post.author_id.substring(0, 8)}...`;
    }
    return (
      post.users.nickname || post.users.name || post.users.email.split("@")[0]
    );
  };

  // 상대시간 표시 함수 - 사용자 친화적 시간 표현
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 줄바꿈 처리 함수 - \n을 <br>로 변환
  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // 로딩 상태 UI
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 UI
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">😵</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              게시글을 찾을 수 없습니다
            </h3>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => fetchPost(resolvedParams.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
              <Link
                href="/posts"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 상단 네비게이션 - Sticky 헤더 */}
      <div className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/posts"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                ← 목록으로
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-bold text-black">게시글 상세</h1>
            </div>

            {/* 작성자만 보이는 수정/삭제 버튼 - 조건부 렌더링 */}
            {user && user.id === post.author_id && (
              <div className="flex gap-2">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  수정
                </button>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* 게시글 헤더 */}
            <div className="p-8 border-b border-gray-100">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-black mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>작성일: {formatTimeAgo(post.created_at)}</span>
                    <span>•</span>
                    <span>조회수: {Math.floor(Math.random() * 200) + 50}</span>
                  </div>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {post.users?.avatar_url ? (
                  <img
                    src={post.users.avatar_url}
                    alt={`${getAuthorName(post)}의 아바타`}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getAuthorName(post).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getAuthorName(post)}
                  </p>
                  <p className="text-sm text-gray-600">{post.users?.email}</p>
                </div>
                <div className="text-xs text-gray-500">작성자</div>
              </div>
            </div>

            {/* 게시글 본문 */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {formatContent(post.content)}
                </div>
              </div>
            </div>

            {/* 하단 액션 버튼들 */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* 상호작용 버튼들 - 추후 기능 확장 예정 */}
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <span>❤️</span>
                    <span>좋아요 {Math.floor(Math.random() * 20)}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <span>💬</span>
                    <span>댓글 {Math.floor(Math.random() * 10)}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                    <span>🔗</span>
                    <span>공유</span>
                  </button>
                </div>

                <Link
                  href="/posts"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  목록으로 돌아가기
                </Link>
              </div>
            </div>
          </article>

          {/* 댓글 섹션 영역 - 추후 확장 */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-bold text-black mb-6">
              댓글{" "}
              <span className="text-blue-600">
                {Math.floor(Math.random() * 10)}
              </span>
            </h3>

            {/* 로그인 사용자만 댓글 작성 가능 */}
            {user ? (
              <div className="mb-8">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                      placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex justify-end mt-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        댓글 작성
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  댓글을 작성하려면 로그인이 필요합니다.
                </p>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  로그인하기 →
                </Link>
              </div>
            )}

            {/* 댓글 목록 영역 */}
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요! 💬
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
