import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';

interface AvatarUploaderProps {
  url: string | null;
  size?: number;
  onUpload: (url: string) => void;
  editable?: boolean;
  userId: string;
  name?: string;
}

export default function AvatarUploader({ url, size = 150, onUpload, editable = false, userId, name }: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      if (url.startsWith('http')) {
        setAvatarUrl(url);
      } else {
        downloadImage(url);
      }
    }
  }, [url]);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      setAvatarUrl(data.publicUrl);
      
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group" style={{ width: size, height: size }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover w-full h-full shadow-md border-4 border-white dark:border-charcoal-800"
        />
      ) : (
        <div className="rounded-full bg-mint-100 dark:bg-charcoal-700 w-full h-full flex items-center justify-center border-4 border-white dark:border-charcoal-800 text-charcoal-400 dark:text-mint-300 overflow-hidden">
          {name ? (
            <span className="text-2xl font-bold text-charcoal-700 dark:text-mint-300">
              {name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircleIcon className="w-3/4 h-3/4" />
          )}
        </div>
      )}
      
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {editable && !uploading && (
        <div className="absolute bottom-0 right-0">
          <label
            className="flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105"
            htmlFor="single"
          >
            <CameraIcon className="w-5 h-5" />
          </label>
          <input
            style={{
              visibility: 'hidden',
              position: 'absolute',
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
