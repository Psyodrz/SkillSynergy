import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Payment {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/payments/user/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch payments');

        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-charcoal-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">No payment history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">Payment History</h2>
        
        <div className="flex gap-2">
          {(['all', 'success', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-charcoal-700 dark:text-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white dark:bg-charcoal-800 rounded-xl p-4 border border-gray-200 dark:border-charcoal-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-charcoal-900 dark:text-white">{payment.plan_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium text-charcoal-900 dark:text-white">
                  {payment.currency === 'INR' ? '₹' : '$'}{payment.amount}
                </span>
              </p>
              {payment.payment_method && (
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="font-medium text-charcoal-900 dark:text-white capitalize">
                    {payment.payment_method}
                  </span>
                </p>
              )}
              {payment.razorpay_payment_id && (
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                  <span className="font-mono text-xs text-charco dark:text-gray-300">
                    {payment.razorpay_payment_id}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-charcoal-800 rounded-xl border border-gray-200 dark:border-charcoal-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-charcoal-700 border-b border-gray-200 dark:border-charcoal-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-charcoal-700">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-charcoal-750">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal-900 dark:text-white">
                  {payment.plan_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {payment.currency === 'INR' ? '₹' : '$'}{payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {payment.payment_method || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500 dark:text-gray-400">
                  {payment.razorpay_payment_id || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
