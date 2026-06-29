import React from "react";

const WHATSAPP_NUMBER = "201553533261";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

function FloatingWhatsApp() {
  return (
    
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.387.696 4.611 1.897 6.49L4 29l7.72-1.86A11.93 11.93 0 0 0 16.001 27C22.629 27 28 21.629 28 15.001 28 8.373 22.629 3 16.001 3zm6.992 17.013c-.297.836-1.476 1.567-2.027 1.654-.55.087-1.06.207-3.36-.7-2.834-1.124-4.657-3.981-4.798-4.17-.14-.187-1.146-1.522-1.146-2.903 0-1.382.726-2.06.984-2.34.258-.28.562-.35.75-.35.187 0 .375.002.539.01.173.008.405-.066.633.483.234.563.794 1.937.864 2.078.07.14.117.305.023.49-.094.187-.14.304-.28.468-.14.164-.293.367-.42.492-.14.14-.286.292-.123.572.164.28.726 1.198 1.557 1.94 1.07.95 1.974 1.244 2.254 1.384.28.14.443.117.608-.07.164-.187.703-.82.891-1.1.187-.282.374-.235.632-.14.258.093 1.629.768 1.91.908.28.14.467.21.537.328.07.117.07.677-.227 1.513z" />
      </svg>
    </a>
  );
}

export default FloatingWhatsApp;