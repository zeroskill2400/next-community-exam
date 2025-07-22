"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

// Toss Payments에서 성공 시 전달하는 URL 쿼리 파라미터 타입
interface PaymentSuccessParams {
  paymentKey: string; // 결제 고유 키 (결제 승인, 조회, 취소에 사용)
  orderId: string; // 주문 번호 (상점에서 생성한 ID)
  amount: string; // 결제 금액 (문자열로 전달됨)
  paymentType?: string; // 결제 타입 (NORMAL, BRANDPAY 등)
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand 스토어에서 장바구니 비우기 함수 가져오기
  // 결제 성공 시 장바구니를 비워서 중복 주문 방지
  const { clearCart } = useCartStore();

  // URL에서 추출한 결제 정보를 저장할 state
  // 초기값은 null로 설정하여 로딩 상태 표시
  const [paymentInfo, setPaymentInfo] = useState<PaymentSuccessParams | null>(
    null
  );

  // 에러 상태 관리 (필수 파라미터 누락 시 사용)
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 URL 파라미터 추출 및 처리
  useEffect(() => {
    // URL 쿼리 파라미터에서 결제 정보 추출
    // Toss Payments는 성공 시 다음 형태로 리다이렉트:
    // /success?paymentKey={PAYMENT_KEY}&orderId={ORDER_ID}&amount={AMOUNT}&paymentType={PAYMENT_TYPE}

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentType = searchParams.get("paymentType");

    // 필수 파라미터 검증
    // paymentKey, orderId, amount는 반드시 있어야 함
    if (!paymentKey || !orderId || !amount) {
      console.error("필수 결제 정보가 누락되었습니다:", {
        paymentKey,
        orderId,
        amount,
      });
      setError("결제 정보를 확인할 수 없습니다.");
      return;
    }

    // 금액 검증 (숫자인지 확인)
    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error("유효하지 않은 결제 금액:", amount);
      setError("결제 금액이 올바르지 않습니다.");
      return;
    }

    // 결제 정보 state에 저장
    setPaymentInfo({
      paymentKey,
      orderId,
      amount,
      paymentType: paymentType || "NORMAL", // 기본값 설정
    });

    // 🔥 중요: 결제 성공 시 장바구니 비우기
    // 이는 사용자가 동일한 상품을 다시 주문하는 것을 방지
    clearCart();

    // 실제 프로덕션에서는 여기서 서버에 결제 승인 API 호출해야 함
    // POST /v1/payments/confirm
    // Body: { paymentKey, orderId, amount }
    // 이 단계에서 실제 결제가 확정됨
    console.log("🎉 결제 성공! 서버에 결제 승인 요청해야 함:", {
      paymentKey,
      orderId,
      amount: numericAmount,
    });
  }, [searchParams, clearCart]); // 의존성 배열 설명:
  // - searchParams: URL 파라미터가 변경되면 재실행
  // - clearCart: 장바구니 비우기 함수 (변경되지 않지만 린터 경고 방지)

  // 홈으로 이동하는 함수
  const goToHome = () => {
    router.push("/");
  };

  // 주문 내역 보기 (실제로는 주문 관리 페이지로 이동)
  const viewOrders = () => {
    // 실제 구현에서는 주문 내역 페이지로 이동
    // 현재는 홈으로 이동
    router.push("/");
  };

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-black mb-2">
              오류가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={goToHome}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태 렌더링
  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">결제 정보를 확인하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 성공 상태 렌더링
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 전체 너비 활용 */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            {/* 성공 아이콘 */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* 성공 메시지 */}
            <h1 className="text-2xl font-bold text-black mb-2">
              결제가 완료되었습니다!
            </h1>
            <p className="text-gray-600 mb-8">주문해 주셔서 감사합니다.</p>

            {/* 결제 정보 표시 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                결제 정보
              </h2>

              <div className="space-y-3">
                {/* 주문번호 */}
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="text-gray-800 font-medium">
                    {paymentInfo.orderId}
                  </span>
                </div>

                {/* 결제금액 */}
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="text-gray-800 font-medium">
                    {parseInt(paymentInfo.amount).toLocaleString()}원
                  </span>
                </div>

                {/* 결제타입 */}
                <div className="flex justify-between">
                  <span className="text-gray-600">결제타입</span>
                  <span className="text-gray-800 font-medium">
                    {paymentInfo.paymentType}
                  </span>
                </div>

                {/* 결제키 (개발자용 정보) */}
                <div className="flex justify-between">
                  <span className="text-gray-600">결제키</span>
                  <span className="text-gray-800 font-mono text-sm">
                    {paymentInfo.paymentKey.substring(0, 20)}...
                  </span>
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              <button
                onClick={viewOrders}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                주문 내역 보기
              </button>

              <button
                onClick={goToHome}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                쇼핑 계속하기
              </button>
            </div>

            {/* 개발자용 디버그 정보 (실제 프로덕션에서는 제거) */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>개발자용 정보:</strong>
              </p>
              <p className="text-xs text-yellow-700">
                실제 서비스에서는 서버에서 /v1/payments/confirm API를 호출하여
                결제를 최종 승인해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
