import { createClient } from '@supabase/supabase-js';

// These are set as build-time env vars (VITE_-prefixed vars are inlined by Vite).
// Locally: put them in a .env file (see .env.example). On Netlify: Site settings →
// Environment variables. The anon key is meant to be public — it's safe to ship in
// the client bundle; access control is enforced server-side by Supabase's Row Level
// Security policies (see supabase/schema.sql), not by keeping this key secret.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once real Supabase credentials are configured. Login/save/load UI hides itself when false. */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
