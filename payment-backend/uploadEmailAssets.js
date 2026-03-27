const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadLogo() {
  const logoPath = path.join(__dirname, '..', 'client', 'public', 'logo.png');
  const fileBuffer = fs.readFileSync(logoPath);
  
  const { data, error } = await supabase.storage
    .from('email-assets')
    .upload('logo.png', fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    console.error('Error uploading logo:', error);
  } else {
    const { data: urlData } = supabase.storage.from('email-assets').getPublicUrl('logo.png');
    console.log('Logo uploaded:', urlData.publicUrl);
  }
}

uploadLogo();
