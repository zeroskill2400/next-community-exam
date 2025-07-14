import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h1>
          <p className="mt-2 text-center text-base text-gray-700">
            계정에 로그인하여 커뮤니티에 참여하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
