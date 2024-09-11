import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthCheck = (redirectTo: string = '/login') => {
  const { isLoggedIn, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      checkAuthStatus().then(isAuthenticated => {
        if (!isAuthenticated) router.push(redirectTo);
      });
    }
  }, [isLoggedIn, isLoading, checkAuthStatus, router, redirectTo]);

  return { isLoggedIn, isLoading };
};