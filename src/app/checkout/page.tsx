"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { useCartStore } from "@/lib/cartStore";

// Toss Payments에서 제공하는 테스트용 클라이언트 키
// 실제 서비스에서는 환경변수(.env)에 저장하여 사용
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export default function CheckoutPage() {
  const router = useRouter();

  // Zustand 스토어에서 장바구니 정보 가져오기
  // items: 장바구니 상품 목록
  // totalPrice: 계산된 총 가격
  // clearCart: 결제 성공 시 장바구니 비우기 위한 함수
  const { items, totalPrice, clearCart } = useCartStore();

  // 결제 위젯 인스턴스를 저장할 state
  // null 초기값으로 설정하여 로딩 상태 구분
  const [paymentWidget, setPaymentWidget] =
    useState<PaymentWidgetInstance | null>(null);

  // UI 렌더링 준비 상태를 나타내는 플래그
  // 결제 위젯이 완전히 로드되고 렌더링되면 true
  const [ready, setReady] = useState(false);

  // 컴포넌트 마운트 시 결제 위젯 초기화
  useEffect(() => {
    // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
    // 이는 URL 직접 접근을 방지하는 보안 조치
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // 비동기 함수로 결제 위젯 로드
    async function initializePaymentWidget() {
      try {
        // 1. Toss Payments SDK 로드 (이것만 Promise 반환)
        // clientKey: 상점을 식별하는 키
        // "ANONYMOUS": 비회원 결제를 위한 특수 문자열
        const widget = await loadPaymentWidget(clientKey, "ANONYMOUS");

        // 2. 결제 UI 렌더링 (동기 함수 - await 불필요)
        // renderPaymentMethods: 결제 수단 선택 UI를 그림
        // - selector: UI를 그릴 HTML 요소의 CSS 선택자
        // - value: 결제 금액 (원 단위)
        // - variantKey: UI 테마 ("DEFAULT"는 기본 테마)
        // 반환값: PaymentMethodsWidget 인스턴스 (Promise가 아님)
        widget.renderPaymentMethods(
          "#payment-method",
          { value: totalPrice },
          { variantKey: "DEFAULT" }
        );

        // 3. 이용약관 UI 렌더링 (동기 함수 - await 불필요)
        // renderAgreement: 결제 관련 약관 동의 UI를 그림
        // - selector: UI를 그릴 HTML 요소의 CSS 선택자
        // - variantKey: 약관 UI 테마
        // 반환값: 약관 위젯 인스턴스 (Promise가 아님)
        widget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

        // 4. 위젯 인스턴스 저장
        // 나중에 결제 요청 시 사용하기 위해 state에 저장
        setPaymentWidget(widget);

        // 5. UI 준비 완료 표시
        setReady(true);
      } catch (error) {
        console.error("결제 위젯 로드 실패:", error);
        // 에러 발생 시 사용자에게 알림 (실제로는 에러 UI 표시)
        alert("결제 시스템을 불러오는데 실패했습니다.");
      }
    }

    initializePaymentWidget();
  }, [items, totalPrice, router]); // 의존성 배열 설명:
  // - items: 장바구니 상품이 변경되면 재실행
  // - totalPrice: 가격이 변경되면 재실행
  // - router: Next.js 라우터 인스턴스 (변경되지 않지만 린터 경고 방지)

  // 결제 요청 처리 함수
  const handlePayment = async () => {
    // 결제 위젯이 아직 로드되지 않았으면 중단
    if (!paymentWidget) {
      alert("결제 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      // 주문 ID 생성 (고유해야 함)
      // Date.now(): 현재 시간을 밀리초로 변환
      const orderId = `ORDER_${Date.now()}`;

      // 주문명 생성 (사용자가 보게 될 상품명)
      const orderName =
        items.length === 1
          ? items[0].name
          : `${items[0].name} 외 ${items.length - 1}건`;

      // 결제 요청
      // requestPayment: 실제 결제창을 띄우는 메서드
      await paymentWidget.requestPayment({
        // 필수 파라미터들:
        orderId, // 주문 고유 ID (6-64자, 영문/숫자/-/_만 가능)
        orderName, // 주문명 (최대 100자)

        // 리다이렉트 URL (결제 완료 후 이동할 페이지)
        // window.location.origin: 현재 도메인 (예: https://myshop.com)
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,

        // 선택 파라미터들 (입력하면 결제창에 자동 입력됨):
        customerName: "테스트 고객",
        customerEmail: "test@example.com",
        customerMobilePhone: "01012345678",
      });

      // 결제창이 열리면 여기서 함수 실행이 멈춤
      // 사용자가 결제를 완료하거나 취소하면 successUrl 또는 failUrl로 이동
    } catch (error: any) {
      // 에러 처리
      console.error("결제 요청 실패:", error);

      // 사용자가 결제창을 닫은 경우
      // Toss는 자동으로 failUrl로 이동시키지 않으므로 수동 처리
      if (
        error.code === "PAY_PROCESS_CANCELED" ||
        error.code === "USER_CANCEL"
      ) {
        // URLSearchParams: URL 쿼리스트링을 쉽게 만들어주는 API
        router.push(
          `/fail?code=${error.code}&message=${encodeURIComponent(
            "결제가 취소되었습니다"
          )}`
        );
      } else {
        // 기타 에러 (네트워크 오류 등)
        router.push(
          `/fail?code=UNKNOWN_ERROR&message=${encodeURIComponent(
            "결제 중 오류가 발생했습니다"
          )}`
        );
      }
    }
  };

  // 장바구니가 비어있으면 아무것도 렌더링하지 않음
  // (이미 useEffect에서 리다이렉트 처리)
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 전체 너비 활용, max-width 제한 제거 */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-black mb-8">결제하기</h1>

        {/* 그리드 레이아웃: 모바일에서는 세로 배치, 데스크톱에서는 가로 배치 */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* 왼쪽 영역: 결제 수단 선택 및 약관 동의 */}
          <div className="md:col-span-2 space-y-4">
            {/* 결제 수단 선택 영역 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                결제 수단
              </h2>
              {/* Toss 결제 위젯이 렌더링될 위치 */}
              <div id="payment-method" />
            </div>

            {/* 약관 동의 영역 */}
            <div className="bg-white rounded-lg p-6">
              {/* Toss 약관 위젯이 렌더링될 위치 */}
              <div id="agreement" />
            </div>
          </div>

          {/* 오른쪽 영역: 주문 요약 및 결제 버튼 */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              주문 요약
            </h2>

            {/* 상품 목록 */}
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-800"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>

            {/* 총 금액 */}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-gray-800">
                <span>총 결제금액</span>
                <span className="text-blue-600">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 결제 버튼 */}
            <button
              onClick={handlePayment}
              disabled={!ready}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {ready ? "결제하기" : "로딩중..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
