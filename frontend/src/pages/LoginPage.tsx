import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authService.login(form);
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center mb-3 shadow-lg shadow-brand-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display">
            Welcome back
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Sign in to your GigFlow account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }));
                if (errors.email) setErrors((e2) => ({ ...e2, email: undefined }));
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm((f) => ({ ...f, password: e.target.value }));
                if (errors.password) setErrors((e2) => ({ ...e2, password: undefined }));
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  className="pointer-events-auto text-surface-400 hover:text-surface-600 transition-colors"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-5">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
