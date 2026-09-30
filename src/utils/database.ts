import { UserAccount, SecurityAuditLog, PaymentTransaction, DatabaseSnapshot } from '../types/auth';
import { Question } from '../types/scratch';
import { DEFAULT_QUESTIONS } from '../data/defaultDeck';

const DB_USERS_KEY = 'smartstudy_db_users';
const DB_QUESTIONS_KEY = 'smartstudy_db_questions';
const DB_LOGS_KEY = 'smartstudy_db_logs';
const DB_TRANSACTIONS_KEY = 'smartstudy_db_transactions';
const DB_CURRENT_USER_KEY = 'smartstudy_current_user';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_admin_01',
    email: 'admin@smartstudy.edu',
    name: 'Dr. Turing (Lead Examiner)',
    role: 'admin',
    isVerified: true,
    isPaidPlan: true,
    planTier: 'campus',
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: new Date().toISOString(),
    quizzesCompleted: 48,
    highScore: 5,
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'user_customer_01',
    email: 'student@smartstudy.edu',
    name: 'Alex Rivera (CS Student)',
    role: 'customer',
    isVerified: true,
    isPaidPlan: false,
    planTier: 'free',
    createdAt: '2026-02-14T10:30:00Z',
    lastLogin: new Date().toISOString(),
    quizzesCompleted: 12,
    highScore: 3,
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'user_customer_02',
    email: 'sarah.chen@university.org',
    name: 'Sarah Chen (Peer Learner)',
    role: 'customer',
    isVerified: true,
    isPaidPlan: true,
    planTier: 'pro',
    createdAt: '2026-03-01T14:15:00Z',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    quizzesCompleted: 26,
    highScore: 5,
    avatarColor: 'bg-emerald-600',
  },
];

export const INITIAL_LOGS: SecurityAuditLog[] = [
  {
    id: 'log_01',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    event: 'SIGN_IN',
    userEmail: 'admin@smartstudy.edu',
    role: 'admin',
    details: 'Admin authentication validated via secure passkey.',
    status: 'SUCCESS',
    ipHash: '192.168.1.xxx-SHA256',
  },
  {
    id: 'log_02',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    event: 'DECK_SAVED',
    userEmail: 'student@smartstudy.edu',
    role: 'customer',
    details: 'Customer saved 3 flashcards into active session.',
    status: 'SUCCESS',
    ipHash: '10.0.0.xxx-SHA256',
  },
];

export class FeatureDatabase {
  // Load Users
  static getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(DB_USERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  static saveUsers(users: UserAccount[]) {
    try {
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    } catch {}
  }

  // Current Active User
  static getCurrentUser(): UserAccount {
    try {
      const stored = localStorage.getItem(DB_CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USERS[1]; // Default to Student/Customer
  }

  static setCurrentUser(user: UserAccount) {
    try {
      localStorage.setItem(DB_CURRENT_USER_KEY, JSON.stringify(user));
    } catch {}
  }

  // Load Questions
  static getQuestions(): Question[] {
    try {
      const stored = localStorage.getItem(DB_QUESTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_QUESTIONS;
  }

  static saveQuestions(questions: Question[]) {
    try {
      localStorage.setItem(DB_QUESTIONS_KEY, JSON.stringify(questions));
    } catch {}
  }

  // Audit Logs
  static getLogs(): SecurityAuditLog[] {
    try {
      const stored = localStorage.getItem(DB_LOGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_LOGS;
  }

  static addLog(event: SecurityAuditLog['event'], userEmail: string, role: SecurityAuditLog['role'], details: string, status: SecurityAuditLog['status'] = 'SUCCESS') {
    const logs = this.getLogs();
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      event,
      userEmail,
      role,
      details,
      status,
      ipHash: `127.0.0.1-${Math.random().toString(16).substring(2, 8)}`,
    };
    const updated = [newLog, ...logs].slice(0, 100);
    try {
      localStorage.setItem(DB_LOGS_KEY, JSON.stringify(updated));
    } catch {}
    return newLog;
  }

  // Payment Transactions
  static getTransactions(): PaymentTransaction[] {
    try {
      const stored = localStorage.getItem(DB_TRANSACTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'tx_demo_01',
        userId: 'user_customer_02',
        userEmail: 'sarah.chen@university.org',
        amount: 9.99,
        currency: 'USD',
        tier: 'pro',
        tierName: 'Student Pro License',
        date: '2026-03-01T14:20:00Z',
        status: 'COMPLETED',
        paymentMethod: 'Credit Card (•••• 4242)',
        receiptNumber: 'REC-2026-0982',
      },
    ];
  }

  static addTransaction(tx: PaymentTransaction) {
    const txs = this.getTransactions();
    const updated = [tx, ...txs];
    try {
      localStorage.setItem(DB_TRANSACTIONS_KEY, JSON.stringify(updated));
    } catch {}
  }

  // Database Export for Google Drive / Local JSON storage
  static exportDatabase(): DatabaseSnapshot {
    return {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      users: this.getUsers(),
      questions: this.getQuestions(),
      auditLogs: this.getLogs(),
      transactions: this.getTransactions(),
      settings: {
        securityLockdown: false,
        requirePasskeyForAdmin: true,
        allowCustomerCustomDecks: true,
      },
    };
  }

  // Database Import from JSON
  static importDatabase(snapshot: DatabaseSnapshot) {
    if (snapshot.users) this.saveUsers(snapshot.users);
    if (snapshot.questions) this.saveQuestions(snapshot.questions);
    if (snapshot.transactions) {
      try {
        localStorage.setItem(DB_TRANSACTIONS_KEY, JSON.stringify(snapshot.transactions));
      } catch {}
    }
    if (snapshot.auditLogs) {
      try {
        localStorage.setItem(DB_LOGS_KEY, JSON.stringify(snapshot.auditLogs));
      } catch {}
    }
  }
}
