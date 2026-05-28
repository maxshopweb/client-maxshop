import { CONTACT_CONFIG, buildWhatsappUrl as buildWhatsappUrlFromConfig } from "@/app/config/contact.config";

export const CONTACT_INFO = CONTACT_CONFIG as typeof CONTACT_CONFIG;

interface UseWhatsappOptions {
  message?: string;
}

export function useWhatsapp({ message }: UseWhatsappOptions = {}) {
  const defaultMessage = CONTACT_CONFIG.advisor.whatsappMessage;
  const { number, display } = CONTACT_INFO.whatsapp;

  const buildUrl = (customMessage?: string) => {
    const effectiveMessage = customMessage ?? message ?? defaultMessage;
    return buildWhatsappUrlFromConfig(effectiveMessage);
  };

  const open = (customMessage?: string) => {
    window.open(buildUrl(customMessage), '_blank', 'noopener,noreferrer');
  };

  return {
    number,
    display,
    email: CONTACT_INFO.email,
    buildUrl,
    open,
  };
}
