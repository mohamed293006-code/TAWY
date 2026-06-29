import React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";

function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-950">تواصل معنا</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        إذا كان لديك أي استفسار أو واجهت مشكلة أثناء استخدام المنصة، يسعدنا تواصلك معنا من خلال وسائل الدعم التالية:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* رابط الواتساب مصلح بالكامل */}
        <a 
          href="https://wa.me/201553533261" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={20} className="text-green-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">واتساب</span>
            <span className="text-sm font-medium text-gray-700" dir="ltr">+20 1553533261</span>
          </div>
        </a>

        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3">
          <Mail size={20} className="text-blue-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">البريد الإلكتروني</span>
            <span className="text-sm font-medium text-gray-700">support@tawy.com</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3">
          <Phone size={20} className="text-purple-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">الدعم الهاتفي</span>
            <span className="text-sm font-medium text-gray-700" dir="ltr">+20 1553533261</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;