'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useCheckoutStore } from '@/app/hooks/checkout/useCheckoutStore';
import { wasCheckoutResultGuest } from '@/app/utils/checkoutGuestResult';

/**
 * Detecta checkout invitado en /checkout/resultado.
 * Usa URL, sessionStorage, store y auth (el logout en resultado borra isGuest/wasGuest del store).
 */
export function useCheckoutResultGuest(): boolean {
  const searchParams = useSearchParams();
  const { isGuest, loading: authLoading } = useAuth();
  const wasGuestStore = useCheckoutStore((s) => s.wasGuest);
  const guestParam = searchParams.get('guest') === '1';

  return useMemo(() => {
    if (guestParam || wasCheckoutResultGuest()) return true;
    if (wasGuestStore) return true;
    if (!authLoading && isGuest) return true;
    return false;
  }, [guestParam, wasGuestStore, isGuest, authLoading]);
}
