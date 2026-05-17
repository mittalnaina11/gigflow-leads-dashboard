import React from 'react';
import { Moon, Sun, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { getInitials } from '@/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <nav className="h-16 border-b border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-surface-900 dark:text-white font-display tracking-tight text-lg">
              GigFlow
            </span>
            <span className="hidden sm:inline ml-2 text-xs font-medium text-brand-500 bg-brand-50 dark:bg-brand-950/50 px-1.5 py-0.5 rounded-md">
              {user?.role === 'admin' ? 'Admin' : 'Sales'}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User info */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {user ? getInitials(user.name) : '?'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-surface-900 dark:text-white leading-none">
                {user?.name}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-surface-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
