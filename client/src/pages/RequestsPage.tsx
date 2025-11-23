import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../hooks/useFriends';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const RequestsPage = () => {
  const { user } = useAuth();
  const { incomingRequests, loading, acceptFriendRequest, rejectFriendRequest } =
    useFriends(user?.id || null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-mint-50 dark:bg-charcoal-900">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-900 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6">
          Friend Requests
        </h1>

        {/* No Requests */}
        {incomingRequests.length === 0 ? (
          <div className="text-center py-12 bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xl rounded-xl shadow border border-mint-200 dark:border-charcoal-700">
            <p className="text-charcoal-600 dark:text-mint-300">
              No pending requests
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {incomingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xl border border-mint-200 dark:border-charcoal-700 rounded-xl shadow p-4 flex items-center justify-between"
              >
                {/* Sender Info */}
                <div className="flex items-center space-x-4">
                  {request.sender?.avatar_url ? (
                    <img
                      src={request.sender.avatar_url}
                      alt={request.sender.full_name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {request.sender?.full_name?.[0] || '?'}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-white">
                      {request.sender?.full_name || 'Unknown User'}
                    </h3>

                    <p className="text-sm text-charcoal-600 dark:text-mint-300">
                      {request.sender?.role || 'Learner'}
                    </p>

                    <p className="text-xs text-charcoal-500 dark:text-mint-400 mt-1">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Accept / Reject */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => acceptFriendRequest(request.id, request.sender_id)}
                    className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20 rounded-full border border-emerald-400/20 hover:bg-emerald-500/20 transition"
                    title="Accept"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20 rounded-full border border-red-400/20 hover:bg-red-500/20 transition"
                    title="Reject"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
