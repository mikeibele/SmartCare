// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on mount
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log('Initial session:', data?.session);
      setSession(data?.session);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', _event, newSession);
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Track session updates every render (for debugging)
  useEffect(() => {
    console.log('Updated session state:', session);
  }, [session]);

  return { session, loading };
}
