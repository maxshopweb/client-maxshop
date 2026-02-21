export const CONTACT_INFO = {
  whatsapp: {
    number: '+5491171506220',
    display: '+54 9 11 7150-6220',
  },
  email: {
    address: 'info@maxshop.com',
    href: 'mailto:info@maxshop.com',
  },
} as const;

interface UseWhatsappOptions {
  message?: string;
}

export function useWhatsapp({ message = '' }: UseWhatsappOptions = {}) {
  const { number, display } = CONTACT_INFO.whatsapp;

  const buildUrl = (customMessage?: string) => {
    const text = encodeURIComponent(customMessage ?? message);
    return `https://wa.me/${number.replace(/\D/g, '')}${text ? `?text=${text}` : ''}`;
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
