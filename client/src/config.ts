// Logic to handle production vs development API URL
// In production, use the deployed backend URL.
// In development, use the env variable (defaults to localhost:5005).
const isProd = import.meta.env.PROD;

// VITE_API_URL should be set in Vercel env vars for the client project
// pointing to the payment-backend deployment URL.
const API_URL = isProd
  ? (import.meta.env.VITE_API_URL || 'https://payment-backend-jrlfxrc1t-psyodrzs-projects.vercel.app')
  : (import.meta.env.VITE_API_URL || 'http://localhost:5005');

export const config = {
  API_URL,
};

export default config;
