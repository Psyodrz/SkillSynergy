// Logic to handle production vs development API URL
// In production, we want to use the relative path (to use Vercel rewrites)
// or the explicit production URL, but NEVER localhost.
const isProd = import.meta.env.PROD;
let API_URL = import.meta.env.VITE_API_URL || '';

if (isProd && API_URL.includes('localhost')) {
  console.warn('Production build detected localhost API_URL. Falling back to relative path.');
  API_URL = '';
}

export const config = {
  API_URL,
};

export default config;
