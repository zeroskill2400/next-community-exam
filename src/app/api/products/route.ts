import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // 카테고리 필터
    if (category) {
      query = query.eq("category", category);
    }

    // 페이지네이션
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = offset ? parseInt(offset) : 0;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error("상품 조회 오류:", error);
      return NextResponse.json(
        { error: "상품을 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      success: true,
    });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
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
