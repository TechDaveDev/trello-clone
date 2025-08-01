"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';

const spanishLocalization = {
  sign_up: {
    email_label: 'Correo Electrónico',
    password_label: 'Crea una Contraseña',
    button_label: 'Registrarse',
    social_provider_text: 'Registrarse con {{provider}}',
    link_text: '¿No tienes una cuenta? Regístrate',
    confirmation_text: 'Revisa tu correo para el enlace de confirmación',
  },
  sign_in: {
    email_label: 'Correo Electrónico',
    password_label: 'Tu Contraseña',
    button_label: 'Iniciar Sesión',
    social_provider_text: 'Iniciar sesión con {{provider}}',
    link_text: '¿Ya tienes una cuenta? Inicia sesión',
  },
  forgotten_password: {
    email_label: 'Correo Electrónico',
    password_label: 'Tu Contraseña',
    button_label: 'Enviar instrucciones',
    link_text: '¿Olvidaste tu contraseña?',
    confirmation_text: 'Revisa tu correo para el enlace de recuperación',
  },
  magic_link: {
    email_input_label: 'Correo Electrónico',
    button_label: 'Enviar enlace mágico',
    confirmation_text: 'Revisa tu correo para el enlace mágico',
  },
};

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
        localization={{
          variables: spanishLocalization,
        }}
      />
    </div>
  );
}