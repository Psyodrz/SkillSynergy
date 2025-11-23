/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: { 
    extend: {
      colors: {
          // Emerald UI palette
          charcoal: {
            950: '#0B0F0E', // deep charcoal
            900: '#111615',
            800: '#1A2120',
            700: '#232A2A', // borders
          },
          mint: {
            50: '#F5FFFB', // soft mint
            100: '#E5F7F1',
            200: '#CFEDE2',
          },
          emerald: {
            300: '#83FFD5',
            400: '#49F2BA',
            500: '#2EE6A8', // primary emerald
            600: '#1CA37C', // deep emerald/teal
            700: '#188F6B',
            900: '#154533'
          },
          teal: {
            100: '#DBFBF5',
            200: '#A3FADF',
            300: '#67E7C9',
            400: '#2EDCB2',
            500: '#1CA37C',
            700: '#11634D'
          },
          // Preserve existing palettes
          primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#5A7BFF', // Main accent blue (will be deprecated later)
            600: '#4c5fd6',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
          accent: {
            blue: '#5A7BFF',
            purple: '#9A49FF',
            glow: 'rgba(90, 123, 255, 0.15)',
          },
          // Dark mode - Navy scale
          navy: {
            950: '#0A0E1A', // Deepest background
            900: '#0F1729', // Primary background
            800: '#1A2332', // Elevated surfaces
            700: '#252E42', // Borders/dividers
            600: '#37415A', // Muted elements
            500: '#505A73',
          },
          // Light mode - Warm scale
          warm: {
            50: '#F7F8FA',   // Primary background
            100: '#EFF1F5',  // Elevated surfaces
            200: '#E6E8EE',  // Borders/dividers
            300: '#D5D7DF',  // Muted elements
            400: '#B8BBC7',  // Disabled state
            500: '#9CA0AE',
          },
          // Keep secondary for compatibility
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
      },
      backgroundImage: {
        'gradient-emerald': 'linear-gradient(135deg, #2EE6A8 0%, #1CA37C 100%)',
        'gradient-emerald-glow': 'radial-gradient(circle at 30% 80%, rgba(46,230,168,0.18) 0%, transparent 75%)',
      },
      boxShadow: {
        'premium-emerald': '0 4px 28px -4px rgba(46,230,168,0.14), 0 2px 8px -2px rgba(28,163,124,0.11)',
        'emerald-glow': '0 0 30px rgba(46, 230, 168, 0.25)',
        'teal-solid': '0 2px 12px 0 rgba(28,163,124,0.07)',
        'deep': '0 10px 40px -8px rgba(12,36,34,0.2)', // For depth
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    }
  },
  plugins: [],
};
