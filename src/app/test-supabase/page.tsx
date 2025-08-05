"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("테스트 중...");
  const [envVars, setEnvVars] = useState<{
    url: string | undefined;
    anonKey: string | undefined;
  }>({
    url: undefined,
    anonKey: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 환경 변수 확인
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvVars({ url, anonKey });

    // Supabase 연결 테스트
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        console.log("URL:", url);
        console.log("Anon Key:", anonKey ? `${anonKey.substring(0, 20)}...` : "undefined");

        // 간단한 쿼리로 연결 테스트
        const { data, error } = await supabase
          .from("posts")
          .select("count")
          .limit(1);

        if (error) {
          console.error("Supabase error:", error);
          setConnectionStatus("연결 실패");
          setError(`Supabase 에러: ${error.message}`);
        } else {
          console.log("Supabase connection successful:", data);
          setConnectionStatus("연결 성공");
          setError(null);
        }
      } catch (err) {
        console.error("Connection test error:", err);
        setConnectionStatus("연결 실패");
        setError(`네트워크 에러: ${err instanceof Error ? err.message : "알 수 없는 에러"}`);
      }
    };

    if (url && anonKey) {
      testConnection();
    } else {
      setConnectionStatus("환경 변수 누락");
      setError("NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Supabase 연결 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">환경 변수 상태</h2>
          
          <div className="space-y-3">
            <div>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className={`ml-2 ${envVars.url ? "text-green-600" : "text-red-600"}`}>
                {envVars.url || "설정되지 않음"}
              </span>
            </div>
            
            <div>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={`ml-2 ${envVars.anonKey ? "text-green-600" : "text-red-600"}`}>
                {envVars.anonKey ? `${envVars.anonKey.substring(0, 20)}...` : "설정되지 않음"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">연결 상태</h2>
          
          <div className="flex items-center space-x-3">
            <span className="font-medium">상태:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === "연결 성공" 
                ? "bg-green-100 text-green-800"
                : connectionStatus === "테스트 중..." 
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}>
              {connectionStatus}
            </span>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium mb-2">에러 정보:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">브라우저 콘솔 확인</h2>
          <p className="text-gray-600 mb-2">
            브라우저의 개발자 도구(F12)를 열고 콘솔 탭에서 추가 정보를 확인하세요.
          </p>
          <p className="text-sm text-gray-500">
            네트워크 탭에서 Supabase API 요청이 차단되거나 CORS 에러가 발생하는지도 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}