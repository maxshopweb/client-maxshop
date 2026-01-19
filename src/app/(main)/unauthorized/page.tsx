'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthGuard } from '@/app/hooks/auth/useAuthGuard';
import AccesDenied from '@/app/components/auth/AccesDenied';
import { getAuthToken } from '@/app/utils/cookies';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { role } = useAuthGuard({ skipRedirect: true });

  useEffect(() => {
    // Si no hay token, redirigir a login
    const authToken = getAuthToken();
    if (!authToken) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <AccesDenied role={role} />
    </div>
  );
}

