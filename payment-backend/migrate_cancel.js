const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../payment-backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Adding cancel_at_period_end column to profiles table...');
  
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: `
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;
    `
  });

  if (error) {
    if (error.message.includes('permission denied')) {
      console.error('Permission denied. Please ensure your service role key is correct and you have schema update permissions.');
    } else {
      console.error('Error adding column:', error.message);
    }
    process.exit(1);
  }

  console.log('Successfully updated profiles table structure.');
}

migrate();
