import React, { useState, useEffect, useRef } from 'react';

type ImageStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';

interface AsyncImageProps {
  entityType: 'SKILL' | 'TUTOR' | 'USER_REQUEST';
  entityId: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  fallbackSrc?: string;
  triggerOnMount?: boolean;
}

const AsyncImage: React.FC<AsyncImageProps> = ({ 
  entityType, 
  entityId, 
  alt, 
  className = "", 
  placeholder,
  fallbackSrc = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Available",
  triggerOnMount = true
}) => {
  const [status, setStatus] = useState<ImageStatus>('PENDING');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const API_BASE = 'http://localhost:5000/api'; // Or usage of environment variable

  const clearPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/images/${entityType}/${entityId}`);
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Error fetching image status:', e);
      return { status: 'FAILED' };
    }
  };

  const triggerGeneration = async () => {
    try {
      setStatus('GENERATING');
      const res = await fetch(`${API_BASE}/images/${entityType}/${entityId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Default prompt logic on backend
      });
      const data = await res.json();
      if (data.status === 'GENERATING' || data.status === 'READY') {
        startPolling();
      } else {
        setStatus('FAILED');
      }
    } catch (e) {
      console.error('Error triggering generation:', e);
      setStatus('FAILED');
    }
  };

  const startPolling = () => {
    clearPolling();
    pollIntervalRef.current = setInterval(async () => {
      const data = await fetchStatus();
      
      if (data.status === 'READY') {
        setImageUrl(data.image_url);
        setStatus('READY');
        clearPolling();
      } else if (data.status === 'FAILED') {
        setStatus('FAILED');
        clearPolling();
      } else {
        // Still GENERATING or PENDING, continue polling
        setStatus(data.status);
      }
    }, 3000); // Poll every 3 seconds
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const data = await fetchStatus();
      
      if (!mounted) return;

      if (data.status === 'READY' && data.image_url) {
        setImageUrl(data.image_url);
        setStatus('READY');
      } else if (data.status === 'GENERATING') {
        setStatus('GENERATING');
        startPolling();
      } else if ((data.status === 'PENDING' || data.status === 'FAILED') && triggerOnMount) {
        // If pending or failed, and we want to trigger, do it once
        // (Maybe check retry count to avoid infinite loops if it keeps failing immediately)
        if (retryCount < 3) {
            triggerGeneration();
        } else {
            setStatus('FAILED');
        }
      } else {
        setStatus(data.status as ImageStatus);
      }
    };

    init();

    return () => {
      mounted = false;
      clearPolling();
    };
  }, [entityType, entityId, retryCount]);  // Retry count dependency allows manual retry

  if (status === 'READY' && imageUrl) {
    return <img src={imageUrl} alt={alt} className={className} onError={() => setStatus('FAILED')} />;
  }

  if (status === 'GENERATING' || status === 'PENDING') {
    return placeholder ? (
      <>{placeholder}</>
    ) : (
      <div className={`flex items-center justify-center bg-gray-800 animate-pulse ${className}`}>
        <div className="flex flex-col items-center">
             <svg className="w-8 h-8 text-blue-500 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="text-xs text-gray-400">Generating AI Image...</span>
        </div>
      </div>
    );
  }

  // FAILED state
  return (
    <div className={`relative group ${className}`}>
        <img src={fallbackSrc} alt={alt} className={`w-full h-full object-cover opacity-50 ${className}`} />
        <div className="absolute inset-0 flex items-center justify-center">
            <button 
                onClick={() => { setRetryCount(c => c + 1); triggerGeneration(); }}
                className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm transition-all"
            >
                Retry Gen
            </button>
        </div>
    </div>
  );
};

export default AsyncImage;
