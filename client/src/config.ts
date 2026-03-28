// Logic to handle production vs development API URL
// In production, we want to use the relative path (to use Vercel rewrites)
// or the explicit production URL, but NEVER localhost.
const isProd = import.meta.env.PROD;
let API_URL = import.meta.env.VITE_API_URL || '';

if (isProd) {
  // Use a dedicated, stable backend alias to avoid 508 Infinite Loop errors with the generic projects alias
  API_URL = 'https://skill-synergy-backend-api.vercel.app';
}

export const config = {
  API_URL,
};

export default config;
