"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserData } from "@/lib/useUserData";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string; // uuid 타입 유지
  title: string; // title 필드 다시 추가
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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserData();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      // users 테이블과 join해서 작성자 정보 가져오기
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
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw supabaseError;
      }

      console.log("Posts fetched:", data);
      setPosts(data || []);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message || "게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 작성자 이름을 표시하는 함수
  const getAuthorName = (post: Post) => {
    if (!post.users) {
      return `사용자 ${post.author_id.substring(0, 8)}...`;
    }

    return (
      post.users.nickname || post.users.name || post.users.email.split("@")[0]
    );
  };

  // 시간 표시 함수
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
    });
  };

  // 내용 미리보기
  const getPreview = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

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

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              오류가 발생했습니다
            </h3>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                fetchPosts();
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-1">게시판</h1>
              <p className="text-gray-700">
                자유롭게 생각을 나누고 이야기해보세요
              </p>
            </div>
            {user && (
              <Link
                href="/posts/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ✏️ 글 작성하기
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-full px-6 py-8">
        {/* 로그인 안내 */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-blue-600 text-2xl">👋</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  환영합니다!
                </h3>
                <p className="text-gray-700 mb-3">
                  게시글을 작성하려면 로그인이 필요합니다.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 게시글 통계 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-800 font-medium">
              총{" "}
              <span className="text-blue-600 font-bold text-lg">
                {posts.length}
              </span>
              개의 게시글
            </p>
            <div className="text-sm text-gray-600">
              최신순으로 정렬되었습니다
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
            <div className="text-gray-400 text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              아직 게시글이 없습니다
            </h3>
            <p className="text-gray-600 mb-8">
              첫 번째 게시글을 작성해서 대화를 시작해보세요!
            </p>
            {user && (
              <Link
                href="/posts/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ✏️ 첫 게시글 작성하기
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* 게시글 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatTimeAgo(post.created_at)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                      </h2>
                    </div>
                  </div>

                  {/* 게시글 내용 미리보기 */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">
                      {getPreview(post.content)}
                    </p>
                  </div>

                  {/* 게시글 푸터 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      {/* 작성자 정보 */}
                      <div className="flex items-center gap-2">
                        {post.users?.avatar_url ? (
                          <img
                            src={post.users.avatar_url}
                            alt={`${getAuthorName(post)}의 아바타`}
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {getAuthorName(post).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getAuthorName(post)}
                          </p>
                          <p className="text-xs text-gray-500">작성자</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* 상호작용 버튼들 */}
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <span>❤️</span>
                          <span>0</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <span>💬</span>
                          <span>0</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                          <span>👀</span>
                          <span>{Math.floor(Math.random() * 50) + 1}</span>
                        </button>
                      </div>

                      <Link
                        href={`/posts/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        자세히 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
