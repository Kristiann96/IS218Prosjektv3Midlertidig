const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xtgzkvgmlsphhuhiyqmn.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z3prdmdtbHNwaGh1aGl5cW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTgyNDUsImV4cCI6MjA1MTgzNDI0NX0.EOQA5jnB_KIfiLzrjIhS-Cp0guYMUXjhqnESBcDNoLI'

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;