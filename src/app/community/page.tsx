"use client";

import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string;
  created_at: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="w-full min-h-screen px-6 py-8">
      <h1 className="text-3xl font-bold text-black mb-8">커뮤니티</h1>

      {/* 로딩 상태 */}
      {loading && <div className="text-gray-500">게시글을 불러오는 중...</div>}

      {/* 에러 상태 */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Posts 목록 */}
      {!loading && !error && (
        <div>
          <p className="text-gray-600 mb-4">총 {posts.length}개의 게시글</p>
          {posts.length === 0 ? (
            <div className="text-gray-500">아직 게시글이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border p-4 rounded">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-600">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {post.author} -{" "}
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
