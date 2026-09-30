import React, { useState } from 'react';
import { UserAccount, PaymentTransaction } from '../types/auth';
import { FeatureDatabase } from '../utils/database';
import { sound } from '../utils/audio';
import { Sparkles, CreditCard, ShieldCheck, CheckCircle2, Zap, Award, X, Lock, Check } from 'lucide-react';

interface PaidPaymentBarProps {
  currentUser: UserAccount;
  onUpgradeSuccess: (updatedUser: UserAccount) => void;
}

export const PaidPaymentBar: React.FC<PaidPaymentBarProps> = ({
  currentUser,
  onUpgradeSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'campus'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    sound.playPop();

    setTimeout(() => {
      setIsProcessing(false);
      sound.playCorrect();

      const newTx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        amount: selectedTier === 'pro' ? 9.99 : 49.0,
        currency: 'USD',
        tier: selectedTier,
        tierName: selectedTier === 'pro' ? 'Student Pro License' : 'Campus Institutional Pass',
        date: new Date().toISOString(),
        status: 'COMPLETED',
        paymentMethod: 'Test Card (•••• 4242)',
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      };

      FeatureDatabase.addTransaction(newTx);
      FeatureDatabase.addLog(
        'PAYMENT_COMPLETED',
        currentUser.email,
        currentUser.role,
        `Payment successful: $${newTx.amount} for ${newTx.tierName} (${newTx.receiptNumber}).`
      );

      // Upgrade user
      const users = FeatureDatabase.getUsers();
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      const updatedUser: UserAccount = {
        ...currentUser,
        isPaidPlan: true,
        planTier: selectedTier,
      };

      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        FeatureDatabase.saveUsers(users);
      }
      FeatureDatabase.setCurrentUser(updatedUser);

      setCompletedTx(newTx);
      onUpgradeSuccess(updatedUser);
    }, 1200);
  };

  return (
    <>
      {/* The Paid Premium Bar */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 rounded-xl px-4 py-2.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {currentUser.isPaidPlan
                  ? `⭐ ${currentUser.planTier.toUpperCase()} PASS ACTIVE`
                  : 'PREMIUM LEARNING PASS'}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-300">
                {currentUser.isPaidPlan
                  ? 'Unlimited AI Generation & Database Cloud Sync Enabled'
                  : 'Unlock Unlimited Gemini AI Synthesis & Certified Lab Transcripts'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!currentUser.isPaidPlan ? (
            <button
              onClick={() => {
                sound.playPop();
                setCompletedTx(null);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade Plan ($9.99)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pro Member: {currentUser.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!completedTx ? (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-1">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    Smart Study Flashcards Pro Upgrade
                  </h3>
                  <p className="text-xs text-slate-400">
                    One-time payment · Instant lifetime feature activation
                  </p>
                </div>

                {/* Tier Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTier('pro')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedTier === 'pro'
                        ? 'border-amber-500 bg-amber-950/30 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-400">Student Pro</span>
                      <span className="font-mono text-sm font-bold text-white">$9.99</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Unlimited Gemini AI card generation & Google Drive persistence.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier('campus')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedTier === 'campus'
                        ? 'border-amber-500 bg-amber-950/30 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-400">Campus Pass</span>
                      <span className="font-mono text-sm font-bold text-white">$49.00</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Full class lab cohort license with Admin grading & audit access.
                    </p>
                  </button>
                </div>

                {/* Simulated Payment Card Form */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulated Secure Payment</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> 256-Bit SSL Demo
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="4242 •••• •••• 4242 (Demo Test Card)"
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">CVC</label>
                      <input
                        type="text"
                        readOnly
                        value="•••"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <span>
                      Complete Purchase (${selectedTier === 'pro' ? '9.99' : '49.00'})
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* Receipt View */
              <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Payment Authorized Successfully!
                </h3>
                <p className="text-xs text-slate-300">
                  Thank you! Your account <strong>{currentUser.email}</strong> is now upgraded to{' '}
                  <span className="text-amber-400 font-bold uppercase">{completedTx.tierName}</span>.
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-left text-xs font-mono space-y-1 text-slate-400">
                  <div><strong>Receipt ID:</strong> {completedTx.receiptNumber}</div>
                  <div><strong>Transaction Hash:</strong> {completedTx.id}</div>
                  <div><strong>Amount Billed:</strong> ${completedTx.amount} USD</div>
                  <div><strong>Date:</strong> {new Date(completedTx.date).toLocaleString()}</div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow transition-colors"
                >
                  Return to Study App
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
