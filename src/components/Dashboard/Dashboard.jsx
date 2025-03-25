import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import Balance from './Balance';
import { getBalance, getTransactions } from '../../services/transaction';
import { logout, getCurrentUser } from '../../services/auth';
import { 
  Home, 
  CreditCard, 
  History, 
  Settings, 
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  User
} from 'lucide-react';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0
  });
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const fetchAccountData = async () => {
    try {
      const data = await getBalance();
      setAccount(data);
      const transactionsData = await getTransactions(data.id);
      setTransactions(transactionsData);
      
      // Calculate income (only self deposits) and expenses (only outgoing transfers)
      const income = transactionsData
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactionsData
        .filter(t => t.type === 'TRANSFER' && t.direction === 'OUT')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({ income, expenses });
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Cards', href: '/dashboard/cards', icon: CreditCard },
    { name: 'Transactions', href: '/dashboard/transactions', icon: History },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-destructive">
          Failed to load account information
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-primary">ABC Bank</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-4 border-t">
              <nav className="px-2 space-y-1">
                {bottomNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                  <div className="flex items-center text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{user?.name}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>

              {/* Content based on route */}
              {location.pathname === '/dashboard/settings' ? (
                <Settings />
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                              <dd className="text-lg font-semibold text-gray-900">${account.balance.toFixed(2)}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ArrowUpRight className="h-6 w-6 text-green-500" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Income</dt>
                              <dd className="text-lg font-semibold text-gray-900">${stats.income.toFixed(2)}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ArrowDownRight className="h-6 w-6 text-red-500" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Expenses</dt>
                              <dd className="text-lg font-semibold text-gray-900">${stats.expenses.toFixed(2)}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CreditCard className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Account Number</dt>
                              <dd className="text-lg font-semibold text-gray-900">{account.number}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-lg p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Transfer</h2>
                      <TransactionForm onTransactionComplete={handleTransactionComplete} />
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
                      <TransactionHistory accountId={account.id} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;