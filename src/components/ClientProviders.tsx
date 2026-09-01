'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1234567890-dummy.apps.googleusercontent.com';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppProvider>{children}</AppProvider>
    </GoogleOAuthProvider>
  );
}
