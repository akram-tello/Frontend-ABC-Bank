import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { deposit, transfer, getBalance } from '../../services/transaction';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionForm = ({ onTransactionComplete }) => {
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    toAccountNumber: '',
    description: '',
    recipientRef: '',
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
      description: '',
      recipientRef: '',
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
        await deposit(amount, formData.description);
        setSuccess('Deposit successful!');
      } else {
        if (!formData.toAccountNumber) {
          throw new Error('Please enter recipient account number');
        }
        if (amount > 5000) {
          throw new Error('Maximum transfer amount is $5,000');
        }

        // Check if user has sufficient balance
        const accountData = await getBalance();
        if (accountData.balance < amount) {
          throw new Error('Insufficient balance for transfer');
        }

        await transfer(formData.toAccountNumber, amount, formData.description, formData.recipientRef);
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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleChange({ target: { name: 'type', value: 'deposit' } })}
            className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
              formData.type === 'deposit'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ArrowDownRight className="h-5 w-5" />
            <span>Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange({ target: { name: 'type', value: 'transfer' } })}
            className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
              formData.type === 'transfer'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ArrowUpRight className="h-5 w-5" />
            <span>Transfer</span>
          </button>
        </div>

        {formData.type === 'transfer' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Recipient Account Number
            </label>
            <Input
              name="toAccountNumber"
              value={formData.toAccountNumber}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter recipient's account number"
              className="w-full"
            />
            <label className="text-sm font-medium text-gray-700">
              Recipient Reference
            </label>
            <Input
              name="recipientRef"
              value={formData.recipientRef}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter recipient reference"
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter transaction description (optional)"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              disabled={loading}
              className="pl-6 w-full"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500">
            Maximum: {formData.type === 'deposit' ? '$10,000' : '$5,000'}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
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
      </form>
    </div>
  );
};

export default TransactionForm; 