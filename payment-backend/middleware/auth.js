const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing in .env file. Auth middleware may fail.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const authMiddleware = async (req, res, next) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Auth middleware: Supabase URL or anon key is not configured');
      return res.status(503).json({ success: false, error: 'Authentication service unavailable' });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Invalid Authorization header format' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ success: false, error: error.message || 'Invalid or expired token' });
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
