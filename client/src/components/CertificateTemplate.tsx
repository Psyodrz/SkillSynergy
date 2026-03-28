import React from 'react';

interface CertificateTemplateProps {
  userName: string;
  courseName: string;
  date: string;
  certificateId: string;
}

export const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ userName, courseName, date, certificateId }, ref) => {
    return (
      <div 
        ref={ref}
        className="w-[1123px] h-[794px] bg-white relative overflow-hidden flex flex-col p-12" // A4 Landscape size roughly at 96 DPI
        style={{ fontFamily: "'Inter', sans-serif", color: '#0f172a' }}
      >
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full border-[16px] border-emerald-600 z-10 pointer-events-none" />
        <div className="absolute top-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] border-[4px] border-teal-200 z-10 pointer-events-none" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-600/10 rounded-br-[100px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-600/10 rounded-tl-[100px]" />

        <div className="z-20 flex flex-col items-center justify-between h-full px-16 py-12 text-center bg-white/95">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <img src="/logo_1x1.png" alt="SkillSynergy Logo" className="w-24 h-24 object-contain" />
            <h1 className="text-4xl font-black tracking-widest text-emerald-800 uppercase">
              SkillSynergy
            </h1>
            <p className="text-lg font-semibold tracking-widest text-teal-600 uppercase mt-4">
              Certificate of Completion
            </p>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center space-y-6 flex-grow justify-center mt-8">
            <p className="text-xl text-gray-500 italic">This is to officially certify that</p>
            <h2 className="text-6xl font-black text-gray-900 capitalize" style={{ fontFamily: 'Georgia, serif' }}>
              {userName}
            </h2>
            <p className="text-xl text-gray-500 italic max-w-2xl mt-4">
              has successfully fulfilled all requirements and completed the intensive curriculum for
            </p>
            <h3 className="text-3xl font-bold text-emerald-600">
              {courseName}
            </h3>
          </div>

          {/* Footer Signatures and Badges */}
          <div className="w-full mt-16 flex justify-between items-end">
            <div className="text-center flex flex-col items-center">
              <div className="w-48 border-b-2 border-gray-400 mb-2 pb-2">
                {/* Dummy Signature Font */}
                <span className="text-3xl" style={{ fontFamily: "'Brush Script MT', cursive" }}>Aditya S.</span>
              </div>
              <p className="font-bold text-gray-700">Aditya Srivastava</p>
              <p className="text-sm text-gray-500">Founder, SkillSynergy</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                Recognized & Certified By
              </p>
              <div className="flex items-center gap-8">
                {/* Google */}
                <div className="text-2xl font-medium tracking-tighter" style={{ fontFamily: "'Product Sans', 'Open Sans', sans-serif" }}>
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </div>
                
                {/* Microsoft */}
                <div className="flex items-center gap-1.5">
                  <div className="grid grid-cols-2 gap-[2px]">
                    <div className="w-2.5 h-2.5 bg-[#F35325]"></div>
                    <div className="w-2.5 h-2.5 bg-[#81BC06]"></div>
                    <div className="w-2.5 h-2.5 bg-[#05A6F0]"></div>
                    <div className="w-2.5 h-2.5 bg-[#FFBA08]"></div>
                  </div>
                  <span className="text-xl font-semibold text-[#737373]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>Microsoft</span>
                </div>
                
                {/* AWS */}
                <div className="flex items-center text-2xl font-bold text-[#232F3E]">
                  AWS
                </div>

                {/* Coursera */}
                <div className="text-2xl font-bold text-[#0056D2]" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                  coursera
                </div>
              </div>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-48 border-b-2 border-gray-400 mb-2 pb-2">
                <span className="text-xl font-medium text-gray-700">{date}</span>
              </div>
              <p className="font-bold text-gray-700">Date of Award</p>
              <p className="text-sm text-gray-400 mt-2 font-mono">ID: {certificateId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';
