import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://sjxuviyiafcoxypgowwy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_lzjrbcgZEYdj1Z3XVzJpbQ_DVBP-HLh'

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)
