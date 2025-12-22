import { useEffect } from 'react';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';

export const useUpdateCheck = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Notify the native plugin that the JS bundle loaded successfully.
    // If we don't do this, the plugin might rollback to the previous version after 30s.
    CapacitorUpdater.notifyAppReady();

    // 2. Listen for update events
    CapacitorUpdater.addListener('updateAvailable', (info: any) => {
      // Info contains { version: '1.0.2' }
      if (confirm(`New update available (v${info.version}). Download now?`)) {
         // The plugin auto-downloads if autoUpdate is true
      }
    });

    CapacitorUpdater.addListener('downloadComplete', (info: any) => {
       if (confirm(`Update v${info.version} ready. Restart now?`)) {
          CapacitorUpdater.set({ id: info.version }); 
       }
    });
    
  }, []);
};
