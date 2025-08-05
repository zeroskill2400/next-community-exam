// 🎯 진짜 초간단 테스트 예제

// 1. 숫자 계산 테스트
test("1 더하기 1은 2다", () => {
  expect(1 + 1).toBe(2);
});

// 2. 문자열 테스트
test("Hello와 World를 합치면 Hello World가 된다", () => {
  const greeting = "Hello" + " " + "World";
  expect(greeting).toBe("Hello World");
});

// 3. 참/거짓 테스트
test("빈 문자열은 거짓이다", () => {
  expect("").toBeFalsy(); // 거짓인지 확인
  expect("안녕").toBeTruthy(); // 참인지 확인
});

// 4. 배열 테스트
test("배열에 특정 값이 포함되어 있다", () => {
  const fruits = ["사과", "바나나", "딸기"];
  expect(fruits).toContain("바나나"); // 배열에 '바나나'가 있는지
  expect(fruits.length).toBe(3); // 배열 길이가 3인지
});

// 5. 함수 만들어서 테스트해보기
function multiply(a: number, b: number): number {
  return a * b;
}

test("곱셈 함수가 제대로 동작한다", () => {
  expect(multiply(3, 4)).toBe(12);
  expect(multiply(5, 0)).toBe(0);
  expect(multiply(-2, 3)).toBe(-6);
});

// 6. 객체 테스트
test("사용자 객체가 올바른 정보를 가진다", () => {
  const user = {
    name: "김철수",
    age: 25,
    email: "kim@test.com",
  };

  expect(user.name).toBe("김철수");
  expect(user.age).toBeGreaterThan(20); // 20보다 큰지
  expect(user.email).toContain("@"); // @가 포함되어 있는지
});

// 7. describe로 관련 테스트 묶기
describe("간단한 계산기 테스트", () => {
  test("더하기가 동작한다", () => {
    expect(2 + 3).toBe(5);
  });

  test("빼기가 동작한다", () => {
    expect(10 - 4).toBe(6);
  });

  test("0으로 나누면 Infinity가 된다", () => {
    expect(5 / 0).toBe(Infinity);
  });
});
