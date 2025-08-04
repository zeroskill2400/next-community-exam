"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Toss Payments에서 실패 시 전달하는 URL 쿼리 파라미터 타입
interface PaymentFailureParams {
  code: string; // 에러 코드 (PAY_PROCESS_CANCELED, USER_CANCEL 등)
  message: string; // 에러 메시지 (사용자에게 표시할 내용)
  orderId?: string; // 주문 번호 (생성된 경우에만 존재)
}

// 에러 코드별 사용자 친화적 메시지 매핑
// Toss Payments 공식 에러 코드를 기반으로 작성
const getErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    PAY_PROCESS_CANCELED: "사용자에 의해 결제가 취소되었습니다.",
    USER_CANCEL: "사용자에 의해 결제가 취소되었습니다.",
    INVALID_CARD_NUMBER: "올바르지 않은 카드번호입니다.",
    INVALID_EXPIRY: "올바르지 않은 유효기간입니다.",
    INVALID_BIRTH: "올바르지 않은 생년월일입니다.",
    INVALID_PASSWORD: "올바르지 않은 카드 비밀번호입니다.",
    CARD_COMPANY_NOT_SUPPORTED: "지원하지 않는 카드사입니다.",
    EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했습니다.",
    NOT_SUPPORTED_INSTALLMENT_PLAN: "지원하지 않는 할부 개월 수입니다.",
    EXCEED_MAX_PAYMENT_AMOUNT: "결제 가능 금액을 초과했습니다.",
    INVALID_PARAMETER: "잘못된 요청입니다.",
    UNAUTHORIZED: "인증되지 않은 요청입니다.",
    FORBIDDEN: "허용되지 않은 요청입니다.",
    PROVIDER_ERROR: "결제 서비스에 일시적인 오류가 발생했습니다.",
    UNKNOWN_PAYMENT_ERROR: "알 수 없는 결제 오류가 발생했습니다.",
  };

  // 매핑된 메시지가 없으면 기본 메시지 반환
  return errorMessages[code] || "결제 처리 중 오류가 발생했습니다.";
};

function FailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 추출한 에러 정보를 저장할 state
  // 초기값은 null로 설정하여 로딩 상태 구분
  const [errorInfo, setErrorInfo] = useState<PaymentFailureParams | null>(null);

  // 에러 정보가 없는 경우 (직접 URL 접근 등)
  const [hasError, setHasError] = useState(false);

  // 컴포넌트 마운트 시 URL 파라미터에서 에러 정보 추출
  useEffect(() => {
    // URLSearchParams에서 필요한 파라미터들 추출
    // get() 메서드는 해당 파라미터가 없으면 null 반환
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    // 필수 파라미터인 code가 없으면 에러 상태로 설정
    if (!code) {
      console.warn("결제 실패 페이지에 필수 파라미터(code)가 없습니다.");
      setHasError(true);
      return;
    }

    // URL 파라미터에서 추출한 정보를 state에 저장
    setErrorInfo({
      code,
      message: message || getErrorMessage(code), // message가 없으면 매핑된 메시지 사용
      orderId: orderId || undefined, // orderId가 없으면 undefined
    });

    // 에러 정보를 콘솔에 기록 (디버깅용)
    console.log("결제 실패 정보:", {
      code,
      message: message || getErrorMessage(code),
      orderId,
    });
  }, [searchParams]);
  // searchParams가 변경될 때마다 useEffect 재실행
  // 의존성 배열에 searchParams를 포함하는 이유:
  // - URL 파라미터가 변경되면 새로운 에러 정보를 추출해야 함
  // - Next.js에서 searchParams는 참조가 변경되므로 안전하게 감지 가능

  // 에러 정보가 로드되지 않은 경우 로딩 표시
  if (!errorInfo && !hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-800">에러 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 정보가 없는 경우 (잘못된 접근)
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-black mb-4">
            잘못된 접근입니다
          </h1>
          <p className="text-gray-800 mb-6">
            올바른 결제 과정을 통해 접근해 주세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 전체 너비 활용, max-width 제한 제거 */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* 실패 아이콘과 메인 메시지 */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-black mb-4">결제 실패</h1>

            {/* 에러 메시지 표시 */}
            <p className="text-gray-800 text-lg mb-2">{errorInfo!.message}</p>

            {/* 에러 코드 표시 (개발자/디버깅용) */}
            <p className="text-gray-600 text-sm">
              에러 코드: {errorInfo!.code}
            </p>
          </div>

          {/* 에러 상세 정보 카드 */}
          <div className="bg-white rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              상세 정보
            </h2>
            <div className="space-y-3">
              {/* 주문번호 표시 (있는 경우에만) */}
              {errorInfo!.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-800">주문번호:</span>
                  <span className="text-gray-800 font-mono">
                    {errorInfo!.orderId}
                  </span>
                </div>
              )}

              {/* 에러 코드 */}
              <div className="flex justify-between">
                <span className="text-gray-800">에러 코드:</span>
                <span className="text-gray-800 font-mono">
                  {errorInfo!.code}
                </span>
              </div>

              {/* 발생 시간 */}
              <div className="flex justify-between">
                <span className="text-gray-800">발생 시간:</span>
                <span className="text-gray-800">
                  {new Date().toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            {/* 다시 결제하기 - 같은 주문번호로 재시도 */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              다시 결제하기
            </button>

            {/* 장바구니로 돌아가기 - 상품 확인/수정 */}
            <button
              onClick={() => router.push("/cart")}
              className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              장바구니로 돌아가기
            </button>

            {/* 홈으로 이동 - 전체 취소 */}
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-300 text-gray-800 py-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              홈으로 이동
            </button>
          </div>

          {/* 고객 지원 안내 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              문제가 지속되시나요?
            </h3>
            <p className="text-sm text-gray-800">
              계속해서 결제에 문제가 발생한다면 고객센터(1588-1234)로 문의해
              주세요.
              <br />
              주문번호와 에러 코드를 알려주시면 더 빠른 해결이 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-800">로딩 중...</p>
        </div>
      </div>
    }>
      <FailPageContent />
    </Suspense>
  );
}
