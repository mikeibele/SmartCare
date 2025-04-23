// services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your real values from Supabase Dashboard > Settings > API
const supabaseUrl = 'https://alfugqxzcmhvpyipkixh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZnVncXh6Y21odnB5aXBraXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzAzNDYsImV4cCI6MjA2MDkwNjM0Nn0.bC_vzFX7Nf0IdiVwbfLOzeOQSkJOCSc5BaazfOAcT7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
