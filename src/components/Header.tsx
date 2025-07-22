"use client";

import { useRouter } from "next/navigation";
import Navigation from "./Navigation";

export default function Header() {
  const router = useRouter();

  // 로고 클릭 시 홈으로 이동
  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleLogoClick}
            >
              Next.js 커뮤니티
            </h1>
          </div>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
