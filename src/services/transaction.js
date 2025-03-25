import api from './api';

export const getBalance = async () => {
  try {
    const response = await api.get('/accounts/balance');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get balance';
  }
};

export const findAccountByNumber = async (accountNumber) => {
  try {
    const response = await api.get(`/accounts/${accountNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Account not found';
  }
};

export const deposit = async (amount, description) => {
  try {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (amount > 10000) {
      throw new Error('Maximum deposit amount is $10,000');
    }

    // First get the user's account
    const accountResponse = await api.get('/accounts/balance');
    const accountId = accountResponse.data.id;

    const response = await api.post('/transactions/deposit', { 
      accountId,
      amount,
      description
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Deposit failed';
  }
};

export const transfer = async (toAccountNumber, amount, description, recipientRef) => {
  try {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (amount > 5000) {
      throw new Error('Maximum transfer amount is $5,000');
    }

    const response = await api.post('/transactions/transfer', {
      toAccountNumber,
      amount,
      description,
      recipientRef
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Transfer failed';
  }
};

export const getTransactions = async (accountId) => {
  try {
    const response = await api.get(`/transactions/${accountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get transactions';
  }
}; 