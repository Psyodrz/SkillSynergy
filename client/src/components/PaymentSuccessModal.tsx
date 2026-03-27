import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose, planName }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full p-8 text-center border border-emerald-500/20"
          >
            {/* Success Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
              className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <CheckBadgeIcon className="w-16 h-16 text-emerald-500 z-10" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 rounded-full blur-xl"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-charcoal-900 dark:text-white mb-2"
            >
              Payment Successful!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-charcoal-600 dark:text-mint-200 mb-8"
            >
              Welcome to the <span className="text-emerald-500 font-bold">{planName}</span> family. Your account is now upgraded and ready for action.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-gradient-emerald text-white font-bold rounded-2xl shadow-emerald-glow hover:shadow-premium-emerald transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <SparklesIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 text-charcoal-500 dark:text-mint-300 font-semibold hover:text-emerald-500 transition-colors"
              >
                Close
              </button>
            </motion.div>

            {/* Subtle background flair */}
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 -m-4 w-24 h-24 bg-teal-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;
