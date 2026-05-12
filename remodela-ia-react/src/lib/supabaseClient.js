import { createClient } from '@supabase/supabase-js';
// NO USAR REQUIRE AQUÍ

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Con VITE_
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

