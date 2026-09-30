export type UserRole = 'admin' | 'customer';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isPaidPlan: boolean;
  planTier: 'free' | 'pro' | 'campus';
  createdAt: string;
  lastLogin: string;
  quizzesCompleted: number;
  highScore: number;
  avatarColor: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: 'SIGN_IN' | 'ROLE_CHANGE' | 'DECK_SAVED' | 'DB_EXPORT' | 'PAYMENT_COMPLETED' | 'ACCESS_DENIED';
  userEmail: string;
  role: UserRole;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  ipHash: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  tier: 'pro' | 'campus';
  tierName: string;
  date: string;
  status: 'COMPLETED' | 'REFUNDED';
  paymentMethod: string;
  receiptNumber: string;
}

export interface DatabaseSnapshot {
  version: string;
  exportedAt: string;
  users: UserAccount[];
  questions: any[];
  auditLogs: SecurityAuditLog[];
  transactions: PaymentTransaction[];
  settings: {
    securityLockdown: boolean;
    requirePasskeyForAdmin: boolean;
    allowCustomerCustomDecks: boolean;
  };
}
