import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lxiitvjhbpkatllnzpys.supabase.co'
const supabaseAnonKey = 'sb_publishable_etbaiHYV6rIWObwFgH2iCg_hNbTQvVQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Session purana hone par atke nahi
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
  db: {
    schema: 'public',
  },
});


