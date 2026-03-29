import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const CATEGORIES = [
  'General Feedback',
  'Bug Report',
  'Feature Suggestion',
  'Course Content',
  'Mentorship Experience'
];

export const StudentFeedbackWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('General Feedback');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-close success message after 3 seconds
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setIsOpen(false);
        // Reset form for next time after closing animation
        setTimeout(() => {
          setStatus('idle');
          setRating(0);
          setMessage('');
          setCategory('General Feedback');
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Listen for custom event to open from anywhere (like Sidebar)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-feedback', handleOpen);
    return () => window.removeEventListener('open-feedback', handleOpen);
  }, []);

  // Don't render until user is loaded
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg('Please select a star rating');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter a message');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const response = await fetch(`${config.API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          rating,
          category,
          message: message.trim(),
          url: window.location.href
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setStatus('success');
    } catch (err: any) {
      console.error('Feedback submit error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}
        aria-label="Give Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={() => status !== 'submitting' && setIsOpen(false)}
        />
      )}

      {/* Widget Modal */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Share Your Feedback
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            disabled={status === 'submitting'}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-700/50 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {status === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-slate-100 mb-2">Thank You!</h4>
            <p className="text-sm text-slate-400">Your feedback helps us make SkillSynergy better for everyone.</p>
          </div>
        )}

        {/* Form State */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
            {/* Rating */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-medium text-slate-300">How would you rate your experience?</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    disabled={status === 'submitting'}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        (hoveredRating || rating) >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-transparent text-slate-600'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback-category" className="text-xs font-medium text-slate-400">Category</label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback-message" className="text-xs font-medium text-slate-400">Details</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'submitting'}
                placeholder="Tell us what you loved or what we can improve..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-500"
              />
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Send Feedback</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-active:translate-x-0 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
};
