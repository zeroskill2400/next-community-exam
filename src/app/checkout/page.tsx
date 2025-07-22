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

  // 결제 요청 함수
  // 사용자가 "결제하기" 버튼을 클릭했을 때 호출됨
  const handlePayment = async () => {
    // 결제 위젯이 아직 로드되지 않았거나 UI 준비가 완료되지 않았으면 중단
    // ready 상태를 확인하는 이유: UI 렌더링이 완료되어야 결제 요청 가능
    if (!paymentWidget || !ready) {
      alert("결제 준비가 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 주문번호 생성 (결제 취소 시에도 사용하기 위해 try 밖에서 선언)
    // 형식: "ORDER_" + 현재 시간의 밀리초 + 4자리 랜덤 숫자
    // 예: ORDER_1640995200000_1234
    // 변수 순서 변경 이유: try-catch에서 orderId를 catch 블록에서도 사용하기 때문
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // 주문명 생성 (사용자가 결제창에서 보게 될 상품명)
    // 교육적 포인트: 조건부 로직으로 단일/복수 상품 구분
    // - 상품이 1개인 경우: 실제 상품명 표시
    // - 상품이 여러 개인 경우: "대표상품명 외 N건" 형태로 표시
    const orderName =
      items.length === 1
        ? items[0].name // 단일 상품: 정확한 상품명
        : `${items[0].name} 외 ${items.length - 1}건`; // 복수 상품: 대표상품 + 개수

    try {
      // Toss Payments에 결제 요청
      // requestPayment는 Promise를 반환하는 비동기 함수
      // 결제창이 열리고 사용자가 결제를 완료하거나 취소할 때까지 대기
      await paymentWidget.requestPayment({
        // === 필수 파라미터들 ===
        // orderId: 주문 고유 ID (6-64자, 영문/숫자/-/_만 가능)
        // - 중복되면 안 됨 (같은 orderId로 재결제 시 오류)
        // - 주문 관리, 결제 조회, 취소 시 사용되는 핵심 식별자
        orderId,

        // orderName: 주문명 (최대 100자)
        // - 결제창과 영수증에 표시되는 상품명
        // - 사용자가 무엇을 구매하는지 명확히 알 수 있어야 함
        orderName,

        // === 리다이렉트 URL (결제 완료 후 이동할 페이지) ===
        // window.location.origin: 현재 도메인 (예: https://myshop.com)
        // 프로덕션에서는 환경변수로 관리하는 것이 좋음
        successUrl: `${window.location.origin}/success`, // 결제 성공 시
        failUrl: `${window.location.origin}/fail`, // 결제 실패 시

        // === 선택 파라미터들 (입력하면 결제창에 자동 입력됨) ===
        // 실제 서비스에서는 로그인한 사용자 정보에서 가져와야 함
        // 현재는 테스트용 더미 데이터 사용
        customerName: "김토스", // 고객명 (결제자 정보)
        customerEmail: "customer@example.com", // 고객 이메일 (영수증 발송용)

        // customerMobilePhone: "01012345678",           // 휴대폰 번호 (선택사항)
        // 주석 처리 이유: 테스트 시 불필요한 정보 입력 생략
      });

      // requestPayment가 성공하면 Toss가 자동으로 successUrl로 리다이렉트
      // 따라서 이 부분은 일반적으로 실행되지 않음
      // 하지만 디버깅을 위해 로그는 남겨둠
      console.log("결제 요청이 완료되었습니다.");
    } catch (error: any) {
      // 결제 과정에서 발생하는 모든 에러를 처리
      // error 객체의 타입을 any로 설정하는 이유: Toss SDK의 에러 타입이 명확하지 않음
      console.error("결제 실패:", error);

      // 에러 객체에서 정보 추출
      // Toss Payments SDK에서 제공하는 에러 형식
      // code: 에러 식별 코드, message: 사용자용 에러 메시지
      const errorCode = error?.code || "UNKNOWN_ERROR";
      const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";

      // 사용자 취소 관련 에러 코드들
      // 이런 경우에는 Toss가 자동으로 failUrl로 리다이렉트하지 않으므로 수동으로 처리
      // 배열로 관리하는 이유: 취소 관련 코드가 여러 개이고 향후 추가될 수 있음
      const userCancelCodes = [
        "PAY_PROCESS_CANCELED", // 결제 과정에서 사용자가 취소 (X 버튼 클릭 등)
        "USER_CANCEL", // 사용자가 직접 취소 (취소 버튼 클릭)
        "PAY_PROCESS_ABORTED", // 결제 프로세스 중단 (브라우저 닫기 등)
      ];

      // 사용자 취소인 경우 fail 페이지로 수동 리다이렉트
      if (userCancelCodes.includes(errorCode)) {
        console.log("사용자에 의한 결제 취소 감지, fail 페이지로 이동");

        // URL 파라미터로 에러 정보 전달
        // new URL 사용 이유: searchParams API로 안전한 URL 인코딩 가능
        const failUrl = new URL("/fail", window.location.origin);
        failUrl.searchParams.append("code", errorCode);
        failUrl.searchParams.append("message", errorMessage);
        failUrl.searchParams.append("orderId", orderId);

        // 페이지 이동 (replace 사용으로 뒤로가기 시 결제 페이지로 돌아가지 않음)
        // router.push 대신 window.location.replace 사용 이유:
        // - 결제 취소 후 뒤로가기로 결제 페이지 재접근 방지
        // - 브라우저 히스토리에서 결제 페이지 제거
        window.location.replace(failUrl.toString());
      } else {
        // 기타 에러인 경우에도 fail 페이지로 이동
        // 네트워크 오류, 서버 오류, 카드 오류 등
        console.log("결제 시스템 오류 감지, fail 페이지로 이동");

        const failUrl = new URL("/fail", window.location.origin);
        failUrl.searchParams.append("code", errorCode);
        failUrl.searchParams.append("message", errorMessage);
        failUrl.searchParams.append("orderId", orderId);

        window.location.replace(failUrl.toString());
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
