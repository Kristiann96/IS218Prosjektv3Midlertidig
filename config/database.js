const { createClient } = require('@supabase/supabase-js');

// Get environment variables from the already-loaded .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing Supabase environment variables. Check your .env file');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;