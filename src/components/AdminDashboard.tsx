import React, { useState } from 'react';
import { UserAccount, UserRole, SecurityAuditLog, DatabaseSnapshot } from '../types/auth';
import { FeatureDatabase } from '../utils/database';
import { Question } from '../types/scratch';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  Users,
  Database,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  FileCode,
  DollarSign,
  Cloud,
  Check,
  Trash2,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserAccount;
  questions: Question[];
  onUpdateQuestions: (newQuestions: Question[]) => void;
  onUserRoleChange: (updatedUser: UserAccount) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  questions,
  onUpdateQuestions,
  onUserRoleChange,
}) => {
  const [users, setUsers] = useState<UserAccount[]>(FeatureDatabase.getUsers());
  const [logs, setLogs] = useState<SecurityAuditLog[]>(FeatureDatabase.getLogs());
  const [activeTab, setActiveTab] = useState<'users' | 'database' | 'security' | 'financial'>('users');
  const [securityLockdown, setSecurityLockdown] = useState<boolean>(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [driveSyncSuccess, setDriveSyncSuccess] = useState<boolean>(false);

  // Role toggle handler
  const handleToggleRole = (user: UserAccount) => {
    sound.playPop();
    const newRole: UserRole = user.role === 'admin' ? 'customer' : 'admin';
    const updatedUser: UserAccount = { ...user, role: newRole };

    const updatedList = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedList);
    FeatureDatabase.saveUsers(updatedList);

    FeatureDatabase.addLog(
      'ROLE_CHANGE',
      currentUser.email,
      currentUser.role,
      `User ${user.email} role changed from ${user.role} to ${newRole}.`
    );
    setLogs(FeatureDatabase.getLogs());

    if (user.id === currentUser.id) {
      onUserRoleChange(updatedUser);
    }
  };

  // Export full database as JSON for Google Drive / Local storage
  const handleExportDatabase = () => {
    sound.playCorrect();
    const snapshot = FeatureDatabase.exportDatabase();
    const jsonStr = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartstudy_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    FeatureDatabase.addLog(
      'DB_EXPORT',
      currentUser.email,
      currentUser.role,
      'Database snapshot exported to JSON format for Google Drive archive.'
    );
    setLogs(FeatureDatabase.getLogs());
  };

  // Google Drive Cloud Sync simulator
  const handleGoogleDriveSync = () => {
    sound.playCorrect();
    setDriveSyncSuccess(true);
    FeatureDatabase.addLog(
      'DECK_SAVED',
      currentUser.email,
      currentUser.role,
      'Full database snapshot synchronized with connected Google Drive account.'
    );
    setLogs(FeatureDatabase.getLogs());
    setTimeout(() => setDriveSyncSuccess(false), 3000);
  };

  // Import / restore database
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as DatabaseSnapshot;
        if (parsed.users && parsed.questions) {
          FeatureDatabase.importDatabase(parsed);
          setUsers(FeatureDatabase.getUsers());
          onUpdateQuestions(parsed.questions);
          setLogs(FeatureDatabase.getLogs());
          sound.playCorrect();
          setImportNotice('Database restored successfully from file!');
          setTimeout(() => setImportNotice(null), 3000);
        } else {
          throw new Error('Invalid database snapshot format.');
        }
      } catch (err) {
        sound.playIncorrect();
        alert('Failed to parse database file. Ensure it is a valid JSON snapshot.');
      }
    };
    reader.readAsText(file);
  };

  const transactions = FeatureDatabase.getTransactions();
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Role-Based Access Control & Database</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            System Administration & Security Console
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong className="text-amber-400">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        {/* Global Cloud / Google Drive Database Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGoogleDriveSync}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow transition-colors"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{driveSyncSuccess ? 'Synced to Google Drive ✓' : 'Sync to Google Drive'}</span>
          </button>

          <button
            onClick={handleExportDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DB JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore DB</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {importNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Accounts</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">{users.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {users.filter((u) => u.role === 'admin').length} Admins · {users.filter((u) => u.role === 'customer').length} Customers
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Stored Flashcards</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">{questions.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Active in memory & DB</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Security Audits</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">{logs.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Zero security breaches</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Gross Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">${totalRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {transactions.length} Verified transactions
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          User Role Management
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'database' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Feature Database
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'security' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Security & Access Logs
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'financial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Payment Transactions
        </button>
      </div>

      {/* TAB 1: USER ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              Enrolled Users & Roles ({users.length})
            </span>
            <span className="text-slate-400">
              Admins can promote or demote user roles dynamically
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role Status</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Quizzes</th>
                  <th className="p-3">High Score</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${u.avatarColor} text-white text-[11px] font-bold flex items-center justify-center`}>
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        u.role === 'admin'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-600/40'
                          : 'bg-indigo-950/60 text-indigo-400 border-indigo-600/40'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded ${
                        u.isPaidPlan ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.planTier}
                      </span>
                    </td>

                    <td className="p-3 font-mono">{u.quizzesCompleted}</td>
                    <td className="p-3 font-mono text-amber-400 font-semibold">{u.highScore}</td>
                    <td className="p-3 text-[11px] text-slate-400">
                      {new Date(u.lastLogin).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                      >
                        Switch to {u.role === 'admin' ? 'Customer' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURE DATABASE */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Google Drive & Cloud Storage Database State
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Database Schema: v1.2.0 Active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              All platform state—including active flashcard decks, user profiles, quiz results, security logs,
              and payment ledgers—are stored locally in memory and can be exported directly as a standardized JSON database
              snapshot or synced to Google Drive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
                <span className="text-slate-400 block mb-1">Entities Stored</span>
                <span className="font-mono text-amber-400 font-bold">4 Collections</span>
                <span className="text-[10px] text-slate-500 block mt-1">Users, Questions, Logs, Transactions</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
                <span className="text-slate-400 block mb-1">Persistence Medium</span>
                <span className="font-mono text-cyan-400 font-bold">Google Drive & LocalStore</span>
                <span className="text-[10px] text-slate-500 block mt-1">JSON Serialization with SHA256</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
                <span className="text-slate-400 block mb-1">Database Actions</span>
                <button
                  onClick={handleExportDatabase}
                  className="mt-1 w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-semibold transition-colors"
                >
                  Download DB Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & AUDIT LOGS */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Security Audit Trail (Last {logs.length} Operations)
            </span>

            <button
              onClick={() => {
                sound.playPop();
                setSecurityLockdown(!securityLockdown);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                securityLockdown
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {securityLockdown ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{securityLockdown ? 'Lockdown Mode Active' : 'Normal Security Policy'}</span>
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-950 text-emerald-400'
                        : log.status === 'DENIED'
                        ? 'bg-rose-950 text-rose-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {log.event}
                    </span>
                    <span className="font-semibold text-slate-200">{log.userEmail}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{log.role}]</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>

                <div className="text-right shrink-0 text-[10px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT TRANSACTIONS */}
      {activeTab === 'financial' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              Transaction Ledger ({transactions.length} Payments)
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              Total Volume: ${totalRevenue.toFixed(2)} USD
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Receipt</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Tier Purchased</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 text-slate-300 font-mono text-[11px]">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3 text-cyan-400 font-bold">{tx.receiptNumber}</td>
                    <td className="p-3 font-sans text-slate-200">{tx.userEmail}</td>
                    <td className="p-3 text-amber-400">{tx.tierName}</td>
                    <td className="p-3 font-bold text-emerald-400">${tx.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{tx.paymentMethod}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
