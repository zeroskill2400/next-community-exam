"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string;
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Posts 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/posts");
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Posts를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("Posts를 불러오는데 실패했습니다.");
        console.error("Posts 조회 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 내용 미리보기 (100자로 제한)
  const getPreviewContent = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "오늘";
    } else if (diffDays === 1) {
      return "어제";
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR");
    }
  };

  // 글 작성 페이지로 이동
  const handleCreatePost = () => {
    router.push("/posts/create");
  };

  // 게시글 상세 페이지로 이동
  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                커뮤니티
              </h1>
              <p className="text-lg text-gray-600">
                함께 소통하고 정보를 나눠요
              </p>
            </div>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              글 작성하기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="w-full px-6 py-8">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                게시글을 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-2xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                오류가 발생했습니다
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* Posts 목록 */}
        {!loading && !error && (
          <div className="w-full">
            {/* 게시글 통계 */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 font-medium">
                  총{" "}
                  <span className="text-blue-600 font-bold">
                    {posts.length}
                  </span>
                  개의 게시글
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    최신순
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    인기순
                  </button>
                </div>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  아직 게시글이 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  첫 번째 게시글을 작성해보세요!
                </p>
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  글 작성하기
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden hover:border-gray-300 cursor-pointer group"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="p-6">
                      {/* 게시글 헤더 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {post.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-gray-700">
                                {post.author}
                              </span>
                            </div>
                            <span>•</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 게시글 내용 미리보기 */}
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {getPreviewContent(post.content)}
                        </p>
                      </div>

                      {/* 게시글 푸터 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>💬</span>
                            <span>댓글 0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👀</span>
                            <span>조회 0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>좋아요 0</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          자세히 보기 →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
