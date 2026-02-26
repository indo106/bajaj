import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lxiitvjhbpkatllnzpys.supabase.co'
const supabaseAnonKey = 'sb_publishable_etbaiHYV6rIWObwFgH2iCg_hNbTQvVQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)