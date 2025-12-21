import React, { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw, ImageIcon, AlertCircle } from 'lucide-react';
import config from '../config';

interface TutorImageBlockProps {
  imageId: string;
  topic: string;
  type: string;
}

type ImageStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';

const TutorImageBlock: React.FC<TutorImageBlockProps> = ({ imageId, topic, type }) => {
  const [status, setStatus] = useState<ImageStatus>('GENERATING');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const pollStatus = async () => {
      if (!mountedRef.current) return;
      
      try {
        const res = await fetch(`${config.API_URL}/api/images/USER_REQUEST/${imageId}`);
        const data = await res.json();
        
        if (!mountedRef.current) return;
        
        setStatus(data.status || 'FAILED');
        
        if (data.status === 'READY' && data.image_url) {
          setImageUrl(data.image_url);
        } else if (data.status === 'FAILED') {
          setError(data.error_message || 'Image generation failed');
        } else if (data.status === 'GENERATING' || data.status === 'PENDING') {
          // Continue polling
          pollRef.current = setTimeout(pollStatus, 3000);
        }
      } catch (err) {
        console.error('Poll error:', err);
        if (mountedRef.current) {
          pollRef.current = setTimeout(pollStatus, 5000);
        }
      }
    };

    pollStatus();

    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [imageId]);

  const handleRetry = async () => {
    setStatus('GENERATING');
    setError(null);
    
    try {
      await fetch(`${config.API_URL}/api/images/USER_REQUEST/${imageId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Start polling again
      const pollStatus = async () => {
        const res = await fetch(`${config.API_URL}/api/images/USER_REQUEST/${imageId}`);
        const data = await res.json();
        
        setStatus(data.status);
        
        if (data.status === 'READY' && data.image_url) {
          setImageUrl(data.image_url);
        } else if (data.status === 'FAILED') {
          setError(data.error_message);
        } else {
          pollRef.current = setTimeout(pollStatus, 3000);
        }
      };
      
      pollRef.current = setTimeout(pollStatus, 2000);
    } catch (err) {
      setStatus('FAILED');
      setError('Failed to retry generation');
    }
  };

  // Loading state
  if (status === 'GENERATING' || status === 'PENDING') {
    return (
      <div className="my-4 rounded-xl border border-teal-500/30 bg-gradient-to-br from-teal-950/50 to-cyan-950/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-teal-500/20">
            <ImageIcon className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-300">Generating {type}</p>
            <p className="text-xs text-gray-400">{topic}</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12 bg-charcoal-900/50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <p className="text-sm text-gray-400">Creating your visual...</p>
            <p className="text-xs text-gray-500">This may take 10-30 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'FAILED') {
    return (
      <div className="my-4 rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/30 to-charcoal-900 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-300">Generation failed</p>
            <p className="text-xs text-gray-400">{error || 'Unknown error'}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Generation
        </button>
      </div>
    );
  }

  // Ready state - show image
  return (
    <div className="my-4 rounded-xl border border-teal-500/30 bg-gradient-to-br from-teal-950/20 to-charcoal-900 p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-4 h-4 text-teal-400" />
        <p className="text-sm font-medium text-teal-300">{type}: {topic}</p>
      </div>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={`${type} - ${topic}`}
          className="w-full max-w-2xl rounded-lg shadow-lg mx-auto"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default TutorImageBlock;
