import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transaction';

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

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-6 mb-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Transactions History
      </h2>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Details</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4">{formatDate(transaction.createdAt)}</td>
                  <td className="p-4">{transaction.type}</td>
                  <td className="p-4">
                    {transaction.type === 'TRANSFER'
                      ? transaction.direction === 'OUT'
                        ? `To: ${transaction.toAccount.number}`
                        : `From: ${transaction.fromAccount.number}`
                      : 'Deposit'}
                  </td>
                  <td className={`p-4 text-right ${
                    transaction.direction === 'OUT' 
                      ? 'text-destructive' 
                      : 'text-green-600'
                  }`}>
                    {formatAmount(transaction.amount, transaction.direction)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory; 