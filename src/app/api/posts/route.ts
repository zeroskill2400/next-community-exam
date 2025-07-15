import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posts - 모든 posts 조회 (Prisma ORM 사용)
export async function GET() {
  try {
    const posts = await prisma.posts.findMany({
      take: 10, // 최대 10개
      orderBy: {
        created_at: "desc", // 최신순 정렬
      },
    });

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Posts 조회 실패:", error);
    return NextResponse.json(
      { success: false, error: "Posts 조회에 실패했습니다." },
      { status: 500 }
    );
  } finally {
    // Prisma 연결 해제
    await prisma.$disconnect();
  }
}
