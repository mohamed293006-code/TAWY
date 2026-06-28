import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    setError("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login.jsx: Google login failed ->", err);
      setError("فشل تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-8 flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          تسجيل الدخول إلى TAWY
        </h1>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.4 0 10.3-1.8 14-5.9l-6.5-5.4C29.5 34.7 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.8 39.6 16.4 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.4C41.9 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Google"}
        </button>
      </div>
    </div>
  );
}

export default Login;