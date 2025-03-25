import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transaction';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionHistory = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions(accountId);
      setTransactions(data);
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [accountId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount, direction) => {
    return `${direction === 'OUT' ? '-' : '+'}$${amount.toFixed(2)}`;
  };

  const getTransactionColor = (transaction) => {
    if (transaction.type === 'TRANSFER' && transaction.direction === 'OUT') {
      return {
        bg: 'bg-red-50',
        text: 'text-red-600',
        icon: <ArrowUpRight className="h-5 w-5" />
      };
    } else if (transaction.type === 'DEPOSIT') {
      return {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: <ArrowDownRight className="h-5 w-5" />
      };
    } else {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: <ArrowDownRight className="h-5 w-5" />
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No transactions found
        </div>
      ) : (
        transactions.map((transaction) => {
          const colors = getTransactionColor(transaction);
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${colors.bg} ${colors.text}`}>
                  {colors.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.type === 'TRANSFER'
                      ? transaction.direction === 'OUT'
                        ? `Transfer to ${transaction.toAccount.number}`
                        : `Transfer from ${transaction.fromAccount.number}`
                      : 'Deposit'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </div>
                  {transaction.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {transaction.description}
                    </div>
                  )}
                  {transaction.recipientRef && (
                    <div className="text-xs text-gray-500 mt-1">
                      Ref: {transaction.recipientRef}
                    </div>
                  )}
                </div>
              </div>
              <div className={`font-medium ${colors.text}`}>
                {formatAmount(transaction.amount, transaction.direction)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionHistory; 