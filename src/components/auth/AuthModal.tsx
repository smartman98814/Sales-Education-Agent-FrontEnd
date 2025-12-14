'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { login, register, type LoginRequest, type RegisterRequest } from '@/api/auth';
import { Motion } from '@/components/common';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup';

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const loginRequest: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        const response = await login(loginRequest);
        if (response.success) {
          toast.success('Signed in successfully!', {
            position: 'bottom-right',
            autoClose: 2000,
          });
          onSuccess?.();
          onClose();
          // Reload page to update auth state
          window.location.reload();
        }
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match', {
            position: 'bottom-right',
            autoClose: 2000,
          });
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters', {
            position: 'bottom-right',
            autoClose: 2000,
          });
          setIsLoading(false);
          return;
        }

        const registerRequest: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName || undefined,
        };
        const response = await register(registerRequest);
        if (response.success) {
          toast.success('Account created successfully!', {
            position: 'bottom-right',
            autoClose: 2000,
          });
          onSuccess?.();
          // Switch to sign in mode after successful registration
          setMode('signin');
          setFormData({ email: formData.email, password: '', confirmPassword: '', displayName: '' });
          toast.info('Please sign in with your new account', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setFormData({ email: '', password: '', confirmPassword: '', displayName: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Motion.div
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black-light border border-gray-700/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-white font-bold text-2xl font-tektur">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <Icon icon="heroicons:x-mark" className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              mode === 'signin'
                ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              mode === 'signup'
                ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                <Icon icon="heroicons:arrow-right" className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

