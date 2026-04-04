import React, { useEffect } from 'react';

interface GoogleAdProps {
  className?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  className = "", 
  adSlot, 
  adFormat = "auto", 
  fullWidthResponsive = "true" 
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-9342367231331552"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default GoogleAd;
