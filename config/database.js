const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = supabaseUrl
const supabaseKey = supabaseKey

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;