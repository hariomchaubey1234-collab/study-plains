import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types/auth';
import { FeatureDatabase } from '../utils/database';
import { sound } from '../utils/audio';
import { ShieldCheck, User, Lock, KeyRound, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: UserRole;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'customer',
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const users = FeatureDatabase.getUsers();

  const handleQuickLogin = (user: UserAccount) => {
    sound.playCorrect();
    FeatureDatabase.addLog(
      'SIGN_IN',
      user.email,
      user.role,
      `User authenticated successfully as ${user.role.toUpperCase()} role.`
    );
    user.lastLogin = new Date().toISOString();
    FeatureDatabase.setCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!targetUser) {
      sound.playIncorrect();
      FeatureDatabase.addLog(
        'ACCESS_DENIED',
        email || 'unknown',
        activeTab,
        'Invalid authentication attempt: Account not found.',
        'DENIED'
      );
      setError(`Account not registered. Please select one of the authorized ${activeTab} profiles below.`);
      return;
    }

    if (activeTab === 'admin' && targetUser.role !== 'admin') {
      sound.playIncorrect();
      FeatureDatabase.addLog(
        'ACCESS_DENIED',
        targetUser.email,
        'customer',
        'RBAC Violation: Non-admin account attempted to enter Admin Portal.',
        'DENIED'
      );
      setError('Access Denied: This account does not possess administrator credentials.');
      return;
    }

    sound.playCorrect();
    FeatureDatabase.addLog(
      'SIGN_IN',
      targetUser.email,
      targetUser.role,
      `User signed in with ${targetUser.role} privileges.`
    );
    targetUser.lastLogin = new Date().toISOString();
    FeatureDatabase.setCurrentUser(targetUser);
    onLoginSuccess(targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">
            {activeTab === 'admin' ? 'Administrator Portal Access' : 'Customer & Student Sign-In'}
          </h3>
          <p className="text-xs text-slate-400">
            Role-Based Access Control (RBAC) with Security Verification
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('customer');
              setError(null);
            }}
            className={`py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('admin');
              setError(null);
            }}
            className={`py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Sign-In</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin@smartstudy.edu' : 'student@smartstudy.edu'}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Security PIN / Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-500/50 rounded-lg text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 text-xs font-semibold rounded-lg shadow transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            Verify & Authenticate {activeTab === 'admin' ? 'Administrator' : 'Customer'}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign-in Profiles */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Instant Demo Accounts:</span>
            <span className="text-[10px] text-amber-400 font-mono">1-Click Sign-In</span>
          </div>

          <div className="space-y-1.5">
            {users
              .filter((u) => (activeTab === 'admin' ? u.role === 'admin' : u.role === 'customer'))
              .map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="w-full p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${u.avatarColor} text-white text-[11px] font-bold flex items-center justify-center`}>
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    u.role === 'admin'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-600/40'
                      : 'bg-indigo-950/60 text-indigo-400 border-indigo-600/40'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
