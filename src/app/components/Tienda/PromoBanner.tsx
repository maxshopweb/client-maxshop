"use client";

import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { getPromoMessages } from "@/app/utils/promos-messages";

export default function PromoBanner() {
  const { data: config } = useConfigTienda();
  const promoMessages = getPromoMessages(config);
  const combinedMessage = promoMessages.join(" / ");

  return (
    <div className="fixed top-0 left-0 right-0 z-[50] bg-secundario text-white h-10 overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <div className="relative h-full flex items-center">
          <div className="flex animate-scroll-infinite whitespace-nowrap">
            {[combinedMessage, combinedMessage].map((message, index) => (
              <div key={index} className="flex items-center mx-8 text-xs md:text-sm font-medium uppercase">
                <span>{message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
