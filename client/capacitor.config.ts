import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillsynergy.app',
  appName: 'SkillSynergy',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      url: 'https://payment-backend-jrlfxrc1t-psyodrzs-projects.vercel.app/api/app-update',
    }
  }
};

export default config;
