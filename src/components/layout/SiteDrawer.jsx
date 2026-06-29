import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sun, Moon, Globe, Info, ShieldCheck, Phone, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

function SiteDrawer({ isOpen, onClose }) {
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  async function handleConfirmLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("SiteDrawer: logout failed ->", error);
    } finally {
      setShowLogoutConfirm(false);
      onClose();
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white z-50 shadow-xl transform transition-transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">القائمة</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900" aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase">الإعدادات</span>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                الوضع الليلي
              </span>
              <span className="text-xs text-gray-400">
                {theme === "dark" ? "مفعّل" : "غير مفعّل"}
              </span>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <Globe size={18} />
                اللغة
              </span>
              <span className="text-xs text-gray-400">
                {language === "ar" ? "العربية" : "English"}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase">عن المتجر</span>

            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <Info size={18} />
              من نحن
            </Link>

            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <ShieldCheck size={18} />
              سياسة الخصوصية
            </Link>

            <Link
              to="/contact-us"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <Phone size={18} />
              تواصل معنا
            </Link>
          </div>

          {user && (
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-400 uppercase">الحساب</span>
              <p className="text-sm text-gray-700 px-3">
                {profile?.displayName || user.displayName || "مستخدم"}
              </p>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-900">تأكيد تسجيل الخروج</h3>
            <p className="text-sm text-gray-600">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-md hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-600 text-white text-sm py-2 rounded-md hover:bg-red-700"
              >
                تأكيد الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SiteDrawer;