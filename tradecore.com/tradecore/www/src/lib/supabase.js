import { createClient } from '@supabase/supabase-js'

// .env okunamazsa bile direkt senin gerçek Supabase projenize vurmasını garanti ediyoruz
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://lgqpaeqlwhbhswmvhmrr.supabase.co'
const supabaseAnonKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_mazJD1fxNZYKLwkfYB0srA_rCc3UaYP'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
