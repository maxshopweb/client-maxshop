"use client";

import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { getPromoMessages } from "@/app/utils/promos-messages";

const REPEAT = 6;

export default function PromoBanner() {
  const { data: config } = useConfigTienda();
  const promoMessages = getPromoMessages(config);
  const items = Array(REPEAT).fill(promoMessages.join(" · "));

  return (
    <div className="fixed top-0 left-0 right-0 z-[50] bg-secundario text-white h-10 overflow-hidden">
      <div className="relative h-full flex items-center">
        <div className="flex animate-scroll-infinite whitespace-nowrap">
          {[...items, ...items].map((message, index) => (
            <span key={index} className="inline-flex items-center px-6 text-xs md:text-sm font-medium uppercase tracking-wide">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
