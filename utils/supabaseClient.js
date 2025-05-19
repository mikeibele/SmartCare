// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://alfugqxzcmhvpyipkixh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZnVncXh6Y21odnB5aXBraXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzAzNDYsImV4cCI6MjA2MDkwNjM0Nn0.bC_vzFX7Nf0IdiVwbfLOzeOQSkJOCSc5BaazfOAcT7I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Required for native apps
  },
});
