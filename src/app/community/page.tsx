"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  // 글 작성 페이지로 이동
  const handleCreatePost = () => {
    router.push("/community/create");
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

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
          <button
            onClick={handleCreatePost}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            글 작성하기
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Posts 목록 */}
        {!loading && !error && (
          <div>
            <p className="text-gray-600 mb-4">총 {posts.length}개의 게시글</p>
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-500">아직 게시글이 없습니다.</p>
                <p className="text-gray-500 mb-4">
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
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {post.users?.avatar_url ? (
                          <img
                            src={post.users.avatar_url}
                            alt={getAuthorName(post)}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {getAuthorName(post).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">
                          {getAuthorName(post)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
