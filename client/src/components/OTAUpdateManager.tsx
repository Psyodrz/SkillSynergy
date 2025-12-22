import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import Modal from './Modal';
import Button from './Button';

// Define explicit types for the event data
interface UpdateInfo {
  version: string;
  source?: string;
}

const OTAUpdateManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [downloadReady, setDownloadReady] = useState<UpdateInfo | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let subAvailable: any;
    let subComplete: any;

    const setupListeners = async () => {
        try {
            // Access plugin via global Capacitor object to avoid build issues
            const CapacitorUpdater = (Capacitor as any).Plugins?.CapacitorUpdater;

            if (!CapacitorUpdater) {
                console.warn('OTA: CapacitorUpdater plugin not found');
                return;
            }

            // 1. Notify native side
            try {
                await CapacitorUpdater.notifyAppReady();
            } catch (e) {
               console.error('OTA: Failed to notify app ready', e);
            }

            // 2. Listen for listeners
            subAvailable = await CapacitorUpdater.addListener('updateAvailable', (info: any) => {
                console.log('OTA: Update available', info);
                setUpdateAvailable({ version: info.version || 'New' });
            });

            subComplete = await CapacitorUpdater.addListener('downloadComplete', (info: any) => {
                console.log('OTA: Download complete', info);
                setDownloadReady({ version: info.version || 'New' });
                setUpdateAvailable(null);
            });
        } catch (e) {
            console.error('OTA: Failed to attach listeners', e);
        }
    };

    setupListeners();

    // Cleanup listeners
    return () => {
        if (subAvailable) subAvailable.remove();
        if (subComplete) subComplete.remove();
    };
  }, []);

  const handleDownload = async () => {
    if (checking) return;
    setChecking(true);
    // Explicit trigger if needed, otherwise relying on background
    setUpdateAvailable(null);
  };

  const handleRestart = async () => {
    if (downloadReady) {
        try {
             const CapacitorUpdater = (Capacitor as any).Plugins?.CapacitorUpdater;
             if (CapacitorUpdater) {
                 await CapacitorUpdater.set({ id: downloadReady.version });
             }
        } catch (e) {
            console.error('OTA: Restart failed', e);
            alert('Failed to restart app. Please restart manually.');
        }
    }
  };

  // Render nothing if no updates
  if (!updateAvailable && !downloadReady) return null;

  return (
    <>
      {/* 1. Update Available Popup */}
      <Modal
        isOpen={!!updateAvailable}
        onClose={() => setUpdateAvailable(null)} // User can dismiss
        title="✨ New Update Available"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            A new version <strong>(v{updateAvailable?.version})</strong> of SkillSynergy is available!
            It includes the latest features and fixes.
          </p>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => setUpdateAvailable(null)} className="w-full">
               Later
             </Button>
             {/* Note: The plugin auto-downloads if configured, but this acknowledges it */}
             <Button variant="primary" onClick={handleDownload} className="w-full">
               Got it!
             </Button>
          </div>
        </div>
      </Modal>

      {/* 2. Download Ready Popup (Requires Restart) */}
      <Modal
        isOpen={!!downloadReady}
        onClose={() => {}} // Block closing? Or allow dismiss? Let's allow dismiss.
        title="🚀 Update Ready"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Update <strong>v{downloadReady?.version}</strong> is ready to install.
            The app needs to restart to apply changes.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-3 rounded-lg text-sm">
             ⚠️ This will reload the application immediately.
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => setDownloadReady(null)} className="w-full">
               Not Now
             </Button>
             <Button variant="primary" onClick={handleRestart} className="w-full">
               Restart App
             </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OTAUpdateManager;
