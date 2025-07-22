import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/posts/[id] - 특정 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15: params는 Promise로 처리
    const { id: postId } = await params;

    console.log("특정 게시글 조회:", postId);

    // 게시글과 작성자 정보, 댓글들 조회
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
        ),
        comments (
          *,
          users:author_id (
            id,
            email,
            name,
            nickname,
            avatar_url
          )
        )
      `
      )
      .eq("id", postId)
      .order("created_at", {
        referencedTable: "comments",
        ascending: false,
      })
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: data,
    });
  } catch (error: any) {
    console.error("게시글 조회 실패:", error);
    return NextResponse.json(
      { success: false, error: error.message || "게시글 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
