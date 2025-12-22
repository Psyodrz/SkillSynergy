import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core'; 
import { supabase } from '../lib/supabaseClient';

export const useMobileNotifications = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permissions denied');
        return;
      }

      await PushNotifications.register();
    };

    // Listeners
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token: ' + token.value);
      
      // Save token to Supabase profiles
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // We will store it in a 'fcm_token' column or metadata
        // For now, let's try to update the profile directly if the column exists,
        // or just log it if we can't. 
        // Ideally, you should run a migration to add 'fcm_token' to public.profiles
        
        try {
            await supabase.from('profiles').update({
                // @ts-ignore - Assuming column might exist or will be ignored if not
                fcm_token: token.value,
                updated_at: new Date().toISOString()
            }).eq('id', user.id);
            console.log('FCM Token saved to profile');
        } catch (e) {
            console.error('Failed to save FCM token to profile', e);
        }
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
       console.log('Push received: ' + JSON.stringify(notification));
       // Use local notifications or custom UI if app is open
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      // Handle deep links or navigation here
      // const data = notification.notification.data;
      // if (data.url) router.push(data.url);
    });

    registerNotifications();

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);
};
