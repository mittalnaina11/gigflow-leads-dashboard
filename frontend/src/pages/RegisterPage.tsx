import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils';

interface FormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const ROLE_OPTIONS = [
  { value: 'sales', label: '💼 Sales User' },
  { value: 'admin', label: '🛡️ Admin' },
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'sales',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authService.register(form);
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Account created! Welcome, ${res.data.user.name}!`);
        navigate('/');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
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
            Create account
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Start managing your leads with GigFlow
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  className="pointer-events-auto text-surface-400 hover:text-surface-600"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password}
              autoComplete="new-password"
            />

            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setField('role', e.target.value as UserRole)}
              options={ROLE_OPTIONS}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
