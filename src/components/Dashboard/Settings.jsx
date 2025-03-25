import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getCurrentUser, updateUser } from '../../services/auth';
import { getBalance } from '../../services/transaction';
import { User, CreditCard, Lock } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: getCurrentUser()?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getBalance();
        setAccount(data);
      } catch (error) {
        console.error('Failed to fetch account:', error);
      }
    };
    fetchAccount();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate passwords if trying to change
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
      }

      await updateUser({
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Profile updated successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md mb-6">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Input
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full"
              placeholder="Enter current password to make changes"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full"
              placeholder="Confirm new password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              'Update Profile'
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <p className="text-sm text-gray-500">Your account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Account Number</label>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {account?.number || 'Loading...'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Current Balance</label>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              ${account?.balance?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 