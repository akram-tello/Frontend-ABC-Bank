import React, { useState, useEffect } from 'react';
import { getBalance } from '../../services/transaction';

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getBalance();
        setBalance(data);
      } catch (error) {
        setError(error.toString());
      }
    };

    fetchBalance();
  }, []);

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
        Account Balance
      </h2>
      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-bold text-primary">
          ${balance?.balance.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground">
          Account Number: {balance?.number}
        </span>
      </div>
    </div>
  );
};

export default Balance; 