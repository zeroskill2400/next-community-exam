// 홈페이지 컴포넌트 테스트 파일
import { render, screen } from "@testing-library/react";
import Home from "../page";

/*
  🎯 모킹(Mocking)이란?
  - 실제 코드 대신 가짜(모의) 객체를 만드는 것
  - 왜 필요한가? 테스트 환경에는 브라우저나 서버가 없기 때문!
  
  🔧 jest.fn()이란?
  - Jest가 제공하는 가짜 함수를 만드는 방법
  - 예시: const 가짜함수 = jest.fn()
  - 이 함수가 호출되었는지, 몇 번 호출되었는지 확인 가능
*/

// 📌 Next.js 라우터 모킹
// 실제로는 페이지 이동을 하지만, 테스트에서는 가짜로 만듦
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      // push: 페이지 이동하는 함수 (예: router.push('/login'))
      push: jest.fn(), // 가짜 push 함수 - 실제로 페이지 이동 안함

      // prefetch: 미리 페이지를 불러오는 함수
      prefetch: jest.fn(), // 가짜 prefetch 함수
    };
  },
}));

// 📌 Zustand 스토어 모킹
// Zustand는 상태 관리 라이브러리 (Redux와 비슷)
// 사용자 로그인 정보를 관리하는 스토어를 가짜로 만듦
jest.mock("@/lib/userStore", () => ({
  useUserStore: () => ({
    user: null, // 로그인하지 않은 상태로 설정
    isLoading: false, // 로딩 중이 아님
    setUser: jest.fn(), // 사용자 정보 설정하는 가짜 함수
    clearUser: jest.fn(), // 로그아웃하는 가짜 함수
  }),
}));

// 📌 useUserData 훅 모킹
// 사용자 데이터를 가져오는 커스텀 훅을 가짜로 만듦
jest.mock("@/lib/useUserData", () => ({
  useUserData: () => ({
    getUserData: jest.fn(), // 사용자 데이터 가져오는 가짜 함수
  }),
}));

/*
  🧪 describe()란?
  - 관련된 테스트들을 그룹으로 묶는 함수
  - 예: describe("계산기", () => { 여러 계산 테스트들... })
*/
describe("홈페이지 테스트", () => {
  /*
    🔄 beforeEach()란?
    - 각 테스트(it)가 실행되기 전에 매번 실행되는 함수
    - 테스트 환경을 깨끗하게 초기화하는 용도
    
    jest.clearAllMocks()는 뭐하는 거?
    - 이전 테스트에서 사용한 모든 가짜 함수들의 호출 기록을 지움
    - 각 테스트가 독립적으로 실행되도록 보장
  */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*
    📝 it() 또는 test()란?
    - 개별 테스트를 작성하는 함수
    - it("설명", () => { 테스트 코드 })
    - test()와 it()은 완전히 같은 기능 (취향 차이)
  */
  it("홈페이지가 정상적으로 렌더링되어야 함", () => {
    // 🎨 render(): React 컴포넌트를 가상 DOM에 그리기
    // 실제 브라우저 없이 메모리에서 컴포넌트를 렌더링
    render(<Home />);

    // 🔍 screen.getByText(): 화면에서 특정 텍스트를 가진 요소 찾기
    // getByText는 못 찾으면 에러 발생 (테스트 실패)
    const heading = screen.getByText("Next.js 커뮤니티");

    // ✅ expect().toBeInTheDocument(): 찾은 요소가 문서에 있는지 확인
    // toBeInTheDocument()는 @testing-library/jest-dom이 제공하는 매처
    expect(heading).toBeInTheDocument();
  });

  it("주요 서비스 섹션이 표시되어야 함", () => {
    render(<Home />);

    // 💡 여러 요소를 한번에 확인하기
    // 각각의 expect는 독립적으로 실행됨
    // 하나라도 실패하면 테스트 전체가 실패
    expect(screen.getByText("상품 쇼핑")).toBeInTheDocument();
    expect(screen.getByText("장바구니")).toBeInTheDocument();
    expect(screen.getByText("커뮤니티")).toBeInTheDocument();
  });

  it("로그인하지 않은 상태에서 로그인 링크가 표시되어야 함", () => {
    render(<Home />);

    // 🔗 링크 요소 찾기
    const loginLink = screen.getByText("로그인하기");

    // 1️⃣ 링크가 화면에 있는지 확인
    expect(loginLink).toBeInTheDocument();

    // 2️⃣ toHaveAttribute(): HTML 속성 확인
    // <a href="/login">로그인하기</a> 에서 href 속성이 "/login"인지 확인
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("네비게이션 링크들이 올바른 경로를 가져야 함", () => {
    render(<Home />);

    // 🧭 여러 링크의 경로를 각각 확인
    // 각 링크가 올바른 페이지로 연결되는지 검증

    // "상품 보러가기" 링크가 /products 페이지로 가는지
    expect(screen.getByText("상품 보러가기")).toHaveAttribute(
      "href",
      "/products"
    );

    // "장바구니 확인" 링크가 /cart 페이지로 가는지
    expect(screen.getByText("장바구니 확인")).toHaveAttribute("href", "/cart");

    // "커뮤니티 참여" 링크가 /community 페이지로 가는지 알아보자
    expect(screen.getByText("커뮤니티 참여")).toHaveAttribute(
      "href",
      "/community"
    );
  });
});

/*
  📚 추가 설명:
  
  1. screen 객체의 다른 메서드들:
     - getByRole(): 역할로 찾기 (button, link, heading 등)
     - getByTestId(): data-testid 속성으로 찾기
     - queryByText(): 없어도 에러 안남 (null 반환)
     - findByText(): 비동기로 나타나는 요소 찾기
  
  2. 자주 사용하는 expect 매처들:
     - toBe(): 정확히 같은지
     - toBeInTheDocument(): DOM에 있는지
     - toHaveAttribute(): 속성을 가지는지
     - toHaveClass(): CSS 클래스를 가지는지
     - toBeVisible(): 화면에 보이는지
     - toBeDisabled(): 비활성화되어 있는지
*/
