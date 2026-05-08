import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE WITH YOUR SUPABASE CREDENTIALS
const supabaseUrl = 'YOUR_PROJECT_URL'; // e.g., https://xxxxx.supabase.co
const supabaseAnonKey = 'YOUR_ANON_KEY'; // starts with eyJ...

export const supabase = createClient(supabaseUrl, supabaseAnonKey);