import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ FALTAN LAS VARIABLES DE ENTORNO DE SUPABASE EN EL BACKEND');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl || '', supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en el .env del backend.');
  }

  return supabaseAdmin;
}