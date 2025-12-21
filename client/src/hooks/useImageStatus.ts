import { useState, useEffect, useRef } from 'react';

interface ImageStatusResult {
  status: 'READY' | 'PENDING' | 'GENERATING' | 'FAILED' | 'UNKNOWN';
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to poll for async image generation status
 * @param endpointUrl The API URL to poll (e.g., /api/skill-thumbnail/123)
 * @param pollIntervalMs How often to poll in milliseconds (default 3000)
 */
export function useImageStatus(endpointUrl: string, generateUrl?: string, pollIntervalMs = 3000): ImageStatusResult {
  const [status, setStatus] = useState<ImageStatusResult['status']>('UNKNOWN');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerAttempted = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const res = await fetch(endpointUrl);
        const data = await res.json();

        if (!isMounted) return;

        if (data.success) {
          const newStatus = data.status || 'READY';
          setStatus(newStatus);
          
          if (newStatus === 'READY') {
            setImageUrl(data.thumbnailUrl || data.imageUrl);
            // Stop polling
            if (pollRef.current) {
              clearTimeout(pollRef.current);
              pollRef.current = null;
            }
          } else if ((newStatus === 'PENDING' || newStatus === 'FAILED') && !triggerAttempted.current && generateUrl) {
            // Trigger generation ONCE
            triggerAttempted.current = true;
            try {
              console.log('Triggering generation for:', generateUrl);
              const genRes = await fetch(generateUrl, { method: 'POST' });
              const genData = await genRes.json();
              if (genData.status === 'GENERATING') {
                setStatus('GENERATING');
              }
            } catch (genError) {
              console.error('Generation trigger failed:', genError);
            }
            // Continue polling to see result
            pollRef.current = setTimeout(checkStatus, pollIntervalMs);
          } else if (newStatus === 'FAILED' && triggerAttempted.current) {
             setError(data.error || 'Generation failed');
             // Stop polling if we already tried and it failed again
             if (pollRef.current) {
               clearTimeout(pollRef.current);
               pollRef.current = null;
             }
          } else {
            // GENERATING or PENDING (waiting for trigger result) -> Continue polling
            pollRef.current = setTimeout(checkStatus, pollIntervalMs);
          }
        } else {
           setStatus('FAILED');
           setError(data.error || 'Request failed');
        }
      } catch (err) {
        if (isMounted) {
           console.error('Image poll error:', err);
           pollRef.current = setTimeout(checkStatus, pollIntervalMs * 2);
        }
      }
    };

    // Initial check
    checkStatus();

    return () => {
      isMounted = false;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [endpointUrl, generateUrl, pollIntervalMs]);

  return {
    status,
    imageUrl,
    isLoading: status === 'PENDING' || status === 'GENERATING' || status === 'UNKNOWN',
    error
  };
}
