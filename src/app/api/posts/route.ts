import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/posts - 모든 posts 조회 (users 정보 포함)
export async function GET(request: NextRequest) {
  try {
    // users 테이블과 join해서 작성자 정보 가져오기
    const { data, error } = await supabase
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

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      posts: data || [],
    });
  } catch (error: any) {
    console.error("Posts 조회 실패:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Posts 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST /api/posts - 새 게시글 작성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author_id } = body;

    // 입력값 유효성 검사
    if (!title || !content || !author_id) {
      return NextResponse.json(
        { success: false, error: "제목, 내용, 작성자 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 새 게시글 생성
    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        author_id,
      })
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
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error: any) {
    console.error("게시글 작성 실패:", error);
    return NextResponse.json(
      { success: false, error: error.message || "게시글 작성에 실패했습니다." },
      { status: 500 }
    );
  }
}
