import React, { useRef, useState } from 'react';
import { CertificateTemplate } from '../components/CertificateTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const CertificatePreviewPage = () => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('SkillSynergy_Certificate_Preview.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 gap-8">
      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <ArrowDownTrayIcon className="w-6 h-6" />
        {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
      </button>

      <div className="shadow-2xl">
        <CertificateTemplate
          ref={certificateRef}
          userName="Aditya Srivastava"
          courseName="Full Stack Web Development Mastery"
          date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          certificateId="SS-PREVIEW-123456"
        />
      </div>
    </div>
  );
};

export default CertificatePreviewPage;
