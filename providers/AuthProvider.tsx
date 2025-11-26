import React, { ReactNode, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments, usePathname } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  
  const { isAuthenticated, token, user } = useAuthStore();
  const { isLoading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Track if we're on an auth route
  const isAuthRoute = segments[0] === '(auth)';
  
  console.log('[AUTH_PROVIDER] 🛡️ Auth state check:', {
    isAuthenticated,
    hasToken: !!token,
    hasUser: !!user,
    isLoading,
    pathname,
    segments,
    isAuthRoute,
    isNavigationReady
  });

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavigationReady || isLoading) {
      return;
    }

    // Don't redirect if we're already navigating
    if (!segments.length) {
      return;
    }

    if (!isAuthenticated) {
      console.log('[AUTH_PROVIDER] 🚫 User not authenticated, redirecting to login');
      // User is not authenticated, redirect to auth
      if (!isAuthRoute) {
        router.replace('/(auth)/login');
      }
    } else {
      console.log('[AUTH_PROVIDER] ✅ User authenticated, allowing access');
      // User is authenticated, redirect away from auth routes
      if (isAuthRoute) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isAuthRoute, segments, isNavigationReady, isLoading, router]);

  // Show loading screen while checking auth state
  if (!isNavigationReady || isLoading) {
    console.log('[AUTH_PROVIDER] ⏳ Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  // Block access to protected routes if not authenticated
  if (!isAuthenticated && !isAuthRoute) {
    console.log('[AUTH_PROVIDER] 🚧 Blocking access to protected route');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  console.log('[AUTH_PROVIDER] ✅ Rendering children');
  return <>{children}</>;
};