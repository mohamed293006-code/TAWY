import React from 'react';
import { FaWhatsApp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const phoneNumber = "201553533261"; // رقمك الدولي المظبوط
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      aria-label="تواصل معنا عبر واتساب"
    >
      <FaWhatsApp size={30} />
    </a>
  );
};

export default FloatingWhatsApp;