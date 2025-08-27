'use client';
import { useEffect } from 'react';
import supabase from '@/lib/supabase';

export default function UserSync() {
  useEffect(() => {
    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.user_metadata.full_name || user.email,
            email: user.email,
          }),
        });
      }
    };
    syncUser();
  }, []);
  return null;
} 