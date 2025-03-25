import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import Balance from './Balance';
import { getBalance } from '../../services/transaction';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccountData = async () => {
    try {
      const data = await getBalance();
      setAccount(data);
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleTransactionComplete = () => {
    fetchAccountData();
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto mt-8">
        <div className="text-xl font-semibold text-destructive text-center">
          Failed to load account information
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Balance balance={account.balance} accountNumber={account.number} />
        </div>
        <div className="col-span-1">
          <TransactionForm onTransactionComplete={handleTransactionComplete} />
        </div>
        <div className="col-span-1">
          <TransactionHistory accountId={account.id} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 