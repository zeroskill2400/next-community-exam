import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/posts - 모든 posts 조회
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }); // 최신순 정렬

    if (error) {
      console.error("Posts 조회 에러:", error);
      return NextResponse.json(
        { success: false, error: "Posts 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
    });
  } catch (error) {
    console.error("Posts 조회 실패:", error);
    return NextResponse.json(
      { success: false, error: "Posts 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
