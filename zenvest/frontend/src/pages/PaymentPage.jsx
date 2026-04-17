/**
 * PaymentPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fintech-grade payment gateway frontend page.
 *
 * States: idle → processing → success | failure
 *
 * Payment methods:
 *   - UPI (VPA input)
 *   - Card (number, expiry, CVV)
 *   - Net Banking (bank selector)
 *   - Wallet (Paytm, PhonePe, etc.)
 *
 * Backend integration point: src/services/analysisService.js → submitPayment()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ShieldCheck, CreditCard, Smartphone, Building2,
  Wallet, Check, AlertCircle, ArrowRight, ChevronDown, X,
} from 'lucide-react';
import { submitPayment } from '../services/analysisService.js';
import PaymentSuccessPage from './PaymentSuccessPage.jsx';

// ── Constants ───────────────────────────────────────────────────────────────

const PLATFORM_FEE_PCT = 0.02;  // 2%
const GST_PCT          = 0.18;  // 18% GST on platform fee

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
  'Canara Bank', 'Union Bank of India', 'IndusInd Bank',
];

const WALLETS = [
  { id: 'paytm',   name: 'Paytm',    emoji: '💰' },
  { id: 'phonepe', name: 'PhonePe',  emoji: '💜' },
  { id: 'gpay',    name: 'Google Pay',emoji: '🟢' },
  { id: 'amazon',  name: 'Amazon Pay',emoji: '🟠' },
];

const PAYMENT_TABS = [
  { id: 'upi',         label: 'UPI',         Icon: Smartphone },
  { id: 'card',        label: 'Card',         Icon: CreditCard },
  { id: 'netbanking',  label: 'Net Banking',  Icon: Building2 },
  { id: 'wallet',      label: 'Wallet',       Icon: Wallet },
];

// ── Shared form field ────────────────────────────────────────────────────────
function PayInput({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-[13px] font-bold text-slate-600 mb-1.5 pl-0.5">{label}</label>}
      <input
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 text-[15px]"
        {...props}
      />
    </div>
  );
}

// ── UPI panel ────────────────────────────────────────────────────────────────
function UPIPanel({ upiId, setUpiId }) {
  return (
    <div className="space-y-4">
      <PayInput
        label="UPI ID / VPA"
        placeholder="yourname@upi"
        value={upiId}
        onChange={e => setUpiId(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {['@oksbi', '@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map(suffix => (
          <button
            key={suffix}
            type="button"
            onClick={() => setUpiId(v => v.split('@')[0] + suffix)}
            className="text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {suffix}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[12px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
        <Smartphone size={14} className="text-blue-500 flex-shrink-0" />
        You'll receive a payment notification on your UPI app to approve the transaction.
      </div>
    </div>
  );
}

// ── Card panel ───────────────────────────────────────────────────────────────
function CardPanel({ card, setCard }) {
  const formatCardNum = v => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim();
  const formatExpiry  = v => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  return (
    <div className="space-y-4">
      <PayInput
        label="Card Number"
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        value={card.number}
        onChange={e => setCard(c => ({ ...c, number: formatCardNum(e.target.value) }))}
      />
      <PayInput
        label="Cardholder Name"
        placeholder="Name as on card"
        value={card.name}
        onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-4">
        <PayInput
          label="Expiry"
          placeholder="MM/YY"
          maxLength={5}
          value={card.expiry}
          onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
        />
        <PayInput
          label="CVV"
          placeholder="•••"
          type="password"
          maxLength={4}
          value={card.cvv}
          onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
        />
      </div>
      <div className="flex items-center gap-2 text-[12px] text-slate-500 bg-green-50 rounded-xl p-3 border border-green-100">
        <Lock size={13} className="text-green-600 flex-shrink-0" />
        Card details are encrypted with 256-bit SSL. We never store your CVV.
      </div>
    </div>
  );
}

// ── Net banking panel ────────────────────────────────────────────────────────
function NetBankingPanel({ bank, setBank }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Select Your Bank</label>
        <div className="relative">
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer"
            value={bank}
            onChange={e => setBank(e.target.value)}
          >
            <option value="">Choose bank…</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
      {bank && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 text-[12px] text-blue-700 bg-blue-50 rounded-xl p-3 border border-blue-100"
        >
          <Building2 size={14} className="flex-shrink-0" />
          You'll be redirected to <strong>{bank}</strong>'s secure net banking portal to complete payment.
        </motion.div>
      )}
    </div>
  );
}

// ── Wallet panel ─────────────────────────────────────────────────────────────
function WalletPanel({ selectedWallet, setSelectedWallet }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {WALLETS.map(w => (
          <button
            key={w.id}
            type="button"
            onClick={() => setSelectedWallet(w.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold text-[14px] transition-all
              ${selectedWallet === w.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }
            `}
          >
            <span className="text-xl">{w.emoji}</span>
            {w.name}
          </button>
        ))}
      </div>
      {selectedWallet && (
        <div className="text-[12px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <Smartphone size={13} className="inline mr-1.5 text-blue-500" />
          Your wallet balance will be debited. Ensure sufficient balance before proceeding.
        </div>
      )}
    </div>
  );
}

// ── Processing overlay ────────────────────────────────────────────────────────
function ProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full"
      />
      <div className="text-center">
        <h3 className="text-[20px] font-extrabold text-slate-800 mb-2">Processing Payment</h3>
        <p className="text-slate-500 text-[14px]">Please do not close this window…</p>
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
        <Lock size={12} /> Secured by 256-bit SSL encryption
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PaymentPage({ navigate, appState, setAppState, showToast }) {
  const plan     = appState.selectedPlan;
  const result   = appState.analysisResult;

  // Payment form state
  const [method,         setMethod]         = useState('upi');
  const [upiId,          setUpiId]          = useState('');
  const [card,           setCard]           = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank,           setBank]           = useState('');
  const [wallet,         setWallet]         = useState('');

  // Flow state: idle | processing | success | failure
  const [payState,       setPayState]       = useState('idle');
  const [txnData,        setTxnData]        = useState(null);
  const [failureMsg,     setFailureMsg]     = useState('');

  if (!plan) { navigate('plan-selection'); return null; }

  // ── Price calculation ────────────────────────────────────────────────────
  const base        = plan.weeklyPremium;
  const platformFee = Math.round(base * PLATFORM_FEE_PCT);
  const gst         = Math.round(platformFee * GST_PCT);
  const total       = base + platformFee + gst;

  // ── Validation by method ─────────────────────────────────────────────────
  const canProceed = () => {
    if (method === 'upi')        return upiId.includes('@');
    if (method === 'card')       return card.number.replace(/\s/g,'').length >= 16 && card.name && card.expiry && card.cvv;
    if (method === 'netbanking') return !!bank;
    if (method === 'wallet')     return !!wallet;
    return false;
  };

  // ── Submit payment ────────────────────────────────────────────────────────
  const handlePay = async () => {
    if (!canProceed()) {
      showToast('Please fill all payment details correctly.', 'error');
      return;
    }
    setPayState('processing');
    try {
      const txn = await submitPayment({
        planId: plan.id,
        amount: total,
        method,
        ...(method === 'upi'   ? { upiId }          : {}),
        ...(method === 'card'  ? { cardLast4: card.number.replace(/\s/g,'').slice(-4) } : {}),
        ...(method === 'netbanking' ? { bank }       : {}),
        ...(method === 'wallet' ? { wallet }         : {}),
      });

      // Store payment result & update app state
      setTxnData(txn);
      setAppState(s => ({
        ...s,
        lastPayment: { ...txn, plan, total },
        plan: {
          key:    plan.id,
          name:   plan.name,
          coverage: plan.coverage,
          premium: total,
          startDate: txn.timestamp,
          endDate:   new Date(Date.now() + 7*24*60*60*1000).toISOString(),
          policyId:  txn.policyId,
        },
      }));
      setPayState('success');
    } catch (err) {
      setFailureMsg(err.message ?? 'Payment failed. Please try again.');
      setPayState('failure');
    }
  };

  // ── Success branch — render inline ──────────────────────────────────────
  if (payState === 'success' && txnData) {
    return <PaymentSuccessPage txn={txnData} plan={plan} total={total} navigate={navigate} />;
  }

  return (
    <>
      {/* Processing overlay */}
      <AnimatePresence>
        {payState === 'processing' && <ProcessingOverlay key="proc" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F8FAFC]">

        {/* Header */}
        <header className="h-[68px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-[22px] tracking-tight text-slate-800">Zenvest</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
            <Lock size={13} className="text-green-500" />
            Secured Payment
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 pt-8 pb-24">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* ── LEFT: Payment method panel ─────────────────────────── */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Step 3 of 3</div>
                <h1 className="text-[26px] font-extrabold text-slate-800 tracking-tight">Complete Payment</h1>
              </motion.div>

              {/* Failure banner */}
              <AnimatePresence>
                {payState === 'failure' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5"
                  >
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-red-800">{failureMsg}</p>
                    </div>
                    <button onClick={() => setPayState('idle')} className="text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Method tabs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden mb-5"
              >
                {/* Tab bar */}
                <div className="flex border-b border-slate-100">
                  {PAYMENT_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMethod(tab.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-4 text-[12px] font-bold uppercase tracking-wide transition-all border-b-2
                        ${method === tab.id
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <tab.Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Panel */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={method}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22 }}
                    >
                      {method === 'upi'        && <UPIPanel        upiId={upiId}   setUpiId={setUpiId} />}
                      {method === 'card'       && <CardPanel        card={card}     setCard={setCard} />}
                      {method === 'netbanking' && <NetBankingPanel   bank={bank}     setBank={setBank} />}
                      {method === 'wallet'     && <WalletPanel selectedWallet={wallet} setSelectedWallet={setWallet} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4 py-4"
              >
                {[
                  { icon: '🔒', text: '256-bit SSL' },
                  { icon: '🏛️', text: 'PCI DSS Compliant' },
                  { icon: '🛡️', text: 'IRDAI Regulated' },
                  { icon: '✅', text: 'RBI Approved' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-1.5 text-[12px] text-slate-500 font-semibold">
                    <span>{b.icon}</span> {b.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Order summary sidebar ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              {/* Plan card */}
              <div className="bg-slate-900 text-white rounded-[20px] p-6 mb-4 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-blue-500/20 rounded-full blur-[40px]" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Selected Plan</p>
                      <h3 className="text-[20px] font-extrabold">{plan.name}</h3>
                      <p className="text-slate-400 text-[13px] mt-0.5">{plan.coverage} coverage</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-blue-400" />
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {plan.features.slice(0, 4).map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-slate-300">
                        <Check size={12} className="text-green-400 flex-shrink-0" strokeWidth={3} />
                        {f}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-[12px] text-slate-500">+{plan.features.length - 4} more benefits</li>
                    )}
                  </ul>

                  {/* Trigger payouts */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Auto-payouts per trigger</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(plan.triggerPayouts).map(([type, amt]) => (
                        <div key={type} className="text-[12px] text-slate-300 flex gap-1.5">
                          {type === 'rain' ? '🌧' : type === 'aqi' ? '🌫' : type === 'heat' ? '🌡' : '💨'}
                          ₹{amt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-white rounded-[20px] border border-slate-200 p-5 mb-4 shadow-sm">
                <h4 className="text-[13px] font-black text-slate-700 uppercase tracking-wide mb-4">Price Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Weekly Premium',              value: `₹${base}` },
                    { label: `Platform Fee (${PLATFORM_FEE_PCT*100}%)`, value: `+₹${platformFee}` },
                    { label: 'GST on Fee (18%)',             value: `+₹${gst}` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-[14px]">
                      <span className="text-slate-500 font-medium">{row.label}</span>
                      <span className="text-slate-700 font-bold">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="text-[15px] font-black text-slate-800">Total Payable</span>
                    <span className="text-[20px] font-black text-slate-900">₹{total}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Renews every Sunday · Cancel anytime</p>
                </div>
              </div>

              {/* Risk badge */}
              {result && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-5 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="text-[13px]">
                    <p className="font-bold text-blue-800">Risk Score: {result.riskScore}/100</p>
                    <p className="text-blue-600 font-medium">{result.riskLabel} Risk · Plan optimised for you</p>
                  </div>
                </div>
              )}

              {/* Pay button */}
              <motion.button
                whileHover={{ scale: canProceed() ? 1.015 : 1 }}
                whileTap={{ scale: canProceed() ? 0.97 : 1 }}
                onClick={handlePay}
                disabled={!canProceed() || payState === 'processing'}
                className={`w-full py-4 rounded-xl font-black text-[16px] flex items-center justify-center gap-3 transition-all
                  ${canProceed()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                <Lock size={17} />
                Pay ₹{total} Securely
                <ArrowRight size={17} />
              </motion.button>
              <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
                By paying you agree to our{' '}
                <span className="text-blue-600 cursor-pointer hover:underline">Terms</span> &{' '}
                <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
