import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST /api/comments - 댓글 작성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, post_id, author_id } = body;

    // 입력값 유효성 검사
    if (!content || !post_id || !author_id) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
      return NextResponse.json(
        { success: false, error: "댓글은 1-2000자 사이로 작성해주세요." },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const { data: postExists } = await supabase
      .from("posts")
      .select("id")
      .eq("id", post_id)
      .single();

    if (!postExists) {
      return NextResponse.json(
        { success: false, error: "존재하지 않는 게시글입니다." },
        { status: 404 }
      );
    }

    // 댓글 생성 - 작성자 정보 포함해서 반환
    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: trimmedContent,
        post_id,
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

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      comment: data,
    });
  } catch (error: any) {
    console.error("댓글 작성 실패:", error);
    return NextResponse.json(
      { success: false, error: error.message || "댓글 작성에 실패했습니다." },
      { status: 500 }
    );
  }
}
