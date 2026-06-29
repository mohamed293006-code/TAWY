import React from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "201553533261";

function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">تواصل معنا</h1>

      <div className="flex flex-col gap-4">
        
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3 hover:bg-gray-50"
        >
          <MessageCircle size={20} className="text-green-600" />
          <span className="text-sm text-gray-700">واتساب: 01553533261</span>
        </a>

        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3">
          <Phone size={20} className="text-gray-600" />
          <span className="text-sm text-gray-700">01553533261</span>
        </div>

        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3">
          <Mail size={20} className="text-gray-600" />
          <span className="text-sm text-gray-700">support@tawy.com</span>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;