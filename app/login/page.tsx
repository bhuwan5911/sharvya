'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Create user in DB if not exists
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.user_metadata.full_name || user.email,
            email: user.email,
          }),
        });
        router.push('/dashboard');
      }
    };
    checkUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Create user in DB if not exists
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: session.user.user_metadata.full_name || session.user.email,
            email: session.user.email,
          }),
        }).then(() => {
          router.push('/dashboard');
        });
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to VoiceMentor</h1>
        <button
          onClick={signInWithGoogle}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 