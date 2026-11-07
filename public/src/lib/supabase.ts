import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://dascjzrsxrctveepnbck.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc2NqenJzeHJjdHZlZXBuYmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5OTY1NzAsImV4cCI6MjEwODU3MjU3MH0.9-m7MFt1fBMzuBzqmWtN3iSUeaVwcK4sNk-Ebq7OjAk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface StoreAgent {
  id: string;
  store_id: string;
  store_name: string;
  contact_phone: string;
  selected_agent: string;
  business_type: string;
  avatar_style: string | null;
  setup_price: number;
  monthly_price: number;
  created_at: string;
  client_name: string;
  custom_notes: string;
  pdf_catalog_url: string;
}

export interface AdminUser {
  id?: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin' | 'operator';
  last_login?: string;
}
