// Logic to handle production vs development API URL
// We hardcode the verified Vercel alias for production to completely bypass stale ENV variables.
const isProd = import.meta.env.PROD;

const API_URL = isProd
  ? 'https://payment-backend-two.vercel.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5005');

export const config = {
  API_URL,
};

export default config;
