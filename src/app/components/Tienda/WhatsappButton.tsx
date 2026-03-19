"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useWhatsapp } from "@/app/hooks/contact/useWhatsapp";

interface WhatsappButtonProps {
  message?: string;
}

export default function WhatsappButton({ message }: WhatsappButtonProps) {
  const { open, display } = useWhatsapp({ message });

  return (
    <button
      onClick={() => open()}
      aria-label={`Contactar por WhatsApp al ${display}`}
      title={`Escribinos al ${display}`}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      style={{ backgroundColor: '#25D366' }}
    >
      <FaWhatsapp size={30} color="#fff" />
    </button>
  );
}
