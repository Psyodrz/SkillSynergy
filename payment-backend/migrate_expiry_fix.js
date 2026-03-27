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
  console.log('Setting default expiry date (1 year) for all existing Pro/Elite users with NULL expiry...');
  
  // We'll update the subscription_expires_at to 1 year from now for any legacy paid account
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_status: 'active'
    })
    .is('subscription_expires_at', null)
    .in('subscription_plan', ['pro', 'premium', 'elite']);

  if (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }

  console.log('Successfully updated legacy accounts with a 1-year expiry date.');
}

migrate();
