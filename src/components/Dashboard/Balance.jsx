import React, { useState, useEffect } from 'react';
import { getBalance } from '../../services/transaction';
import { Wallet } from 'lucide-react';

const Balance = ({ balance, accountNumber }) => {
  if (!balance) {
    return (
      <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
        Failed to load balance information
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Available Balance
              </dt>
              <dd className="text-2xl font-semibold text-gray-900">
                ${balance.toFixed(2)}
              </dd>
              <dt className="text-sm font-medium text-gray-500 mt-1">
                Account Number
              </dt>
              <dd className="text-sm text-gray-900">
                {accountNumber}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance; 