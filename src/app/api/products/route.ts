import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// GET - 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log("API 호출됨 - 상품 목록 조회");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    console.log("검색 파라미터:", { category, limit, offset });

    // Prisma를 사용한 쿼리
    const whereClause: any = {
      is_active: true,
    };

    if (category) {
      whereClause.category = category;
    }

    const limitNum = limit ? parseInt(limit) : undefined;
    const offsetNum = offset ? parseInt(offset) : undefined;

    console.log("WHERE 절:", whereClause);

    const products = await prisma.products.findMany({
      where: whereClause,
      orderBy: {
        created_at: "desc",
      },
      take: limitNum,
      skip: offsetNum,
    });

    console.log("Prisma 조회된 상품 개수:", products?.length || 0);

    return NextResponse.json({
      products: products || [],
      success: true,
    });
  } catch (error) {
    console.error("API 오류 상세:", error);
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}

// POST - 새 상품 추가 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, image_url, category, stock_quantity } =
      body;

    // 필수 필드 검증
    if (!name || !price) {
      return NextResponse.json(
        { error: "상품명과 가격은 필수입니다." },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price: parseInt(price),
          image_url,
          category,
          stock_quantity: stock_quantity || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("상품 추가 오류:", error);
      return NextResponse.json(
        { error: "상품 추가에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product,
      success: true,
      message: "상품이 성공적으로 추가되었습니다.",
    });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
