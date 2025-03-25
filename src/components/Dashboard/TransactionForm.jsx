import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { deposit, transfer } from '../../services/transaction';

const TransactionForm = ({ onTransactionComplete }) => {
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    toAccountNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      amount: '',
      toAccountNumber: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (formData.type === 'deposit') {
        if (amount > 10000) {
          throw new Error('Maximum deposit amount is $10,000');
        }
        await deposit(amount);
        setSuccess('Deposit successful!');
      } else {
        if (!formData.toAccountNumber) {
          throw new Error('Please enter recipient account number');
        }
        if (amount > 5000) {
          throw new Error('Maximum transfer amount is $5,000');
        }
        await transfer(formData.toAccountNumber, amount);
        setSuccess('Transfer successful!');
      }

      resetForm();
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (error) {
      setError(error.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        New Transaction
      </h2>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Transaction Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          {formData.type === 'transfer' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Recipient Account Number
              </label>
              <Input
                name="toAccountNumber"
                value={formData.toAccountNumber}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter recipient's account number"
              />
              <p className="text-xs text-muted-foreground">
                Enter the recipient's account number
              </p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-6"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: {formData.type === 'deposit' ? '$10,000' : '$5,000'}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : formData.type === 'deposit' ? (
              'Deposit'
            ) : (
              'Transfer'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm; 