"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';

export default function LoginForm() {
  const router = useRouter();

  const [theme, setTheme] = useState('light');

  useEffect(() => {

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.refresh();
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
        Bienvenido
      </h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        theme={theme as 'light' | 'dark'}
      />
    </div>
  );
}