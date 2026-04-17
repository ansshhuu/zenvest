/**
 * RegisterPageNew.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full multi-step onboarding flow for Zenvest:
 *
 *  Step 1 — Phone + OTP verification
 *  Step 2 — Detailed user profile (all ML-relevant fields)
 *  Step 3 — Aadhaar document upload (front + back)
 *  Step 4 — Password creation
 *  Step 5 — Review all data
 *  Step 6 — Result: computed risk label + recommended plan
 *
 * Architecture:
 *  • All onboarding data lives in a single `formData` state object.
 *  • Risk calculation is delegated to `utils/riskEngine.js` (easily swappable).
 *  • The stepper never overlaps — full labels on ≥768 px, icon+number on mobile.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Check, Lock, ArrowRight, User as UserIcon,
  MapPin, Briefcase, Phone, Clock, AlertTriangle, Wind, Cloud,
  Upload, FileImage, Star, ChevronDown, Eye, EyeOff,
} from 'lucide-react';
import { getRiskMeta } from '../utils/riskEngine';
import { getRiskSignals, predictRisk } from '../services/api';
import { api } from '../utils/api'; // make sure this is added
import axios from 'axios'

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: 'Phone',    shortTitle: 'Phone',    icon: '📱' },
  { id: 2, title: 'Details',  shortTitle: 'Details',  icon: '👤' },
  { id: 3, title: 'Aadhaar',  shortTitle: 'Aadhaar',  icon: '🪪' },
  { id: 4, title: 'Password', shortTitle: 'Pass',     icon: '🔒' },
  { id: 5, title: 'Review',   shortTitle: 'Review',   icon: '✅' },
  { id: 6, title: 'Result',   shortTitle: 'Result',   icon: '🎯' },
];

const TOTAL_STEPS = STEPS.length;

const PLATFORM_OPTIONS = [
  { value: 'swiggy', label: 'Swiggy' },
  { value: 'zomato', label: 'Zomato' },
  { value: 'blinkit', label: 'Blinkit' },
  { value: 'zepto', label: 'Zepto' },
  { value: 'dunzo', label: 'Dunzo' },
  { value: 'porter', label: 'Porter' },
  { value: 'other',  label: 'Other' },
];


// ─── Initial state ─────────────────────────────────────────────────────────────

function getInitialFormData() {
  return {
    // Step 1 — Phone + OTP
    phone: '',
    otp: ['', '', '', '', '', ''],
    otpSent: false,
    otpVerified: false,

    // Step 3 — Aadhaar upload
    aadhaar: {
      frontFile: null,
      backFile: null,
      frontPreview: null,
      backPreview: null,
      frontName: '',
      backName: '',
      consent: false,
    },

    // Step 4 — Password
    password: '',
    confirmPassword: '',

    // Step 6 — Computed result (populated after step 5)
    riskLabel: null,
    recommendedPlan: null,
  };
}

// ─── Validation helpers ────────────────────────────────────────────────────────

function validateStep(step, formData, otpSent) {
  switch (step) {
    case 1:
      if (formData.phone.length < 10) return 'Enter a valid 10-digit phone number.';
      if (!otpSent) return '__SEND_OTP__';
      if (formData.otp.join('').length < 6) return 'Enter the 6-digit OTP.';
      return null;
    case 2: {
      const d = formData;
      if (!d.fullName.trim())   return 'Full name is required.';
      if (!d.city.trim())       return 'City is required.';
      if (!d.platform)          return 'Please select a delivery platform.';
      if (!d.weeklyHours || isNaN(Number(d.weeklyHours))) return 'Enter valid weekly hours.';
      if (!d.tenureMonths || isNaN(Number(d.tenureMonths))) return 'Enter tenure in months.';
      if (d.pastClaims === '' || isNaN(Number(d.pastClaims))) return 'Enter past claims count.';
      return null;
    }
    case 3:
      if (!formData.aadhaar.frontFile) return 'Please upload the front side of your Aadhaar.';
      if (!formData.aadhaar.backFile)  return 'Please upload the back side of your Aadhaar.';
      if (!formData.aadhaar.consent)   return 'Please accept the consent to proceed.';
      return null;
    case 4:
      if (formData.password.length < 8)                          return 'Password must be at least 8 characters.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
      return null;
    case 5:
      return null; // Review step — no validation needed
    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RegisterPageNew({ navigate, showToast, setAppState }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData);

  // Step 2 — Details form (manual fields only)
  const [detailsFormData, setDetailsFormData] = useState({
    fullName: "",
    city: "",
    platform: "",
    weeklyHours: "",
    tenureMonths: "",
    pastClaims: "",
  });

  // Step 2 — Live Risk Signals (auto-calculated)
  const [riskSignals, setRiskSignals] = useState({
    zoneRisk: "",
    weatherRisk: null,
    aqiRisk: null,
    trustScore: 80,
  });

  // Generic top-level updater
  const updateForm = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Live Risk Signals fetching (triggered when city changes)
  const [loadingSignals, setLoadingSignals] = useState(false);
  const handleCityChanged = useCallback(async (city) => {
    if (!city?.trim()) {
      setRiskSignals({
        zoneRisk: "",
        weatherRisk: null,
        aqiRisk: null,
        trustScore: 80,
      });
      return;
    }

    try {
      setLoadingSignals(true);
      const data = await getRiskSignals(city.trim());
      setRiskSignals({
        zoneRisk: data.zoneRisk ?? "",
        weatherRisk: data.weatherRisk ?? null,
        aqiRisk: data.aqiRisk ?? null,
        trustScore: data.trustScore ?? 80,
      });
    } catch (error) {
      console.error("Failed to fetch risk signals", error);
      showToast("Could not fetch live signals", "error");
    } finally {
      setLoadingSignals(false);
    }
  }, [showToast]);

  // Updater for aadhaar object
  const updateAadhaar = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      aadhaar: { ...prev.aadhaar, [field]: value },
    }));
  }, []);

  // ─── OTP logic (mock — structured for API swap) ──────────────────────────
  // const handleSendOTP = () => {
  //   setLoading(true);
  //   // TODO: replace with API call → POST /api/auth/send-otp { phone }
  //   setTimeout(() => {
  //     setLoading(false);
  //     setOtpSent(true);
  //     showToast(`OTP sent securely to +91 ${formData.phone}`, 'success');
  //   }, 900);
  // };


const handleSendOTP = async () => {
  if (formData.phone.length !== 10) {
    return showToast("Enter valid 10-digit phone number", "error");
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `http://192.168.1.99:8080/api/v1/auth/send-otp`,
      {
        phone: `${formData.phone}`,
      }
    );

    const data = response.data;

    setOtpSent(true);
    showToast(data.message || "OTP sent successfully", "success");

  } catch (err) {
    console.error(err);

    showToast(
      err.response?.data?.message || "Failed to send OTP",
      "error"
    );
  } finally {
    setLoading(false);
  }
};







  // ─── Navigation ──────────────────────────────────────────────────────────
  const handleNext = async () => {
    const error = validateStep(currentStep, currentStep === 2 ? detailsFormData : formData, otpSent);
    if (error === '__SEND_OTP__') return handleSendOTP();
    if (error) return showToast(error, 'error');

    if (currentStep === 5) {
      setLoading(true);
      const d = detailsFormData;
      const rs = riskSignals;
      const payload = {
        city: d.city,
        platform: d.platform,
        zone_risk: rs.zoneRisk,
        weekly_hours: Number(d.weeklyHours),
        past_claims: Number(d.pastClaims),
        weather_risk: rs.weatherRisk,
        aqi_risk: rs.aqiRisk,
        tenure_months: Number(d.tenureMonths),
        trust_score: rs.trustScore / 100,
      };

      try {
        const result = await predictRisk(payload);
        setFormData(prev => ({
          ...prev,
          riskLabel: result.prediction.risk_label,
          recommendedPlan: result.prediction.recommended_plan
        }));
        
        setAppState(s => ({
          ...s,
          user: { ...d, name: d.fullName, phone: formData.phone },
          analysisResult: { 
            riskLabel: result.prediction.risk_label,
            riskScore: result.prediction.risk_score,
            explanation: result.prediction.explanation,
            trustScore: result.prediction.trust_score,
            scoreBreakdown: result.prediction.score_breakdown.map(b => ({
              name: b.name,
              pct: b.pct,
              description: b.description
            })),
            suggestions: result.prediction.suggestions,
            availablePlans: result.prediction.available_plans,
            recommendedPlanId: result.prediction.recommended_plan_id
          },
          // Legacy support
          plan: result.prediction.recommended_plan
        }));



        showToast('Risk analysis complete!', 'success');
        setCurrentStep(6);
      } catch (error) {
        console.error("Prediction failed", error);
        showToast("Prediction service error", "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 6) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setDirection(step < currentStep ? -1 : 1);
    setCurrentStep(step);
  };

  // ─── Slide animation variants ────────────────────────────────────────────
  const slideVariants = {
    initial:  d => ({ x: d > 0 ? 36 : -36, opacity: 0, scale: 0.97 }),
    active:   { x: 0, opacity: 1, scale: 1, transition: { duration: 0.38, ease: [0.25, 1, 0.5, 1] } },
    exit:     d => ({ x: d > 0 ? -36 : 36, opacity: 0, scale: 0.97, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } }),
  };

  const isLastStep     = currentStep === TOTAL_STEPS;
  const isResultStep   = currentStep === 6;
  const progressPct    = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  // ─── Button label ────────────────────────────────────────────────────────
  const buttonLabel = () => {
    if (loading) return null;
    if (isResultStep) return <span className="flex items-center gap-2">View Analysis & Plans <ArrowRight size={18} /></span>;
    if (currentStep === 1 && !otpSent) return 'Send OTP';
    if (currentStep === 5) return <span className="flex items-center gap-2">Compute My Risk <ShieldCheck size={18} /></span>;
    return <span className="flex items-center gap-2 text-[15px]">Continue <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" /></span>;
  };

  const handleFinalAction = () => {
    if (isResultStep) {
      navigate('risk-result');
    } else {
      handleNext();
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Background ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Header */}
      <header className="h-[72px] bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('home')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none" className="group-hover:scale-105 transition-transform">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-slate-800">Zenvest</span>
        </motion.div>
        <button onClick={() => navigate('home')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          Exit setup
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center pt-10 pb-20 px-4 relative z-10 w-full max-w-2xl mx-auto">

        {/* ── Stepper ───────────────────────────────────────────────────── */}
        <Stepper currentStep={currentStep} progressPct={progressPct} />

        {/* ── Content card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[520px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.09)] border border-slate-100 overflow-hidden relative"
        >
          {/* Top colour bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="active"
              exit="exit"
              className="p-8 sm:p-10 min-h-[500px] flex flex-col"
            >
              <div className="flex-1">
                {currentStep === 1 && (
                  <StepPhone formData={formData} updateForm={updateForm} otpSent={otpSent} />
                )}
                {currentStep === 2 && (
                  <StepDetails 
                    formData={detailsFormData}
                    setFormData={setDetailsFormData}
                    riskSignals={riskSignals}
                    onCityChanged={handleCityChanged}
                    loadingSignals={loadingSignals}
                  />
                )}
                {currentStep === 3 && (
                  <StepAadhaar aadhaar={formData.aadhaar} updateAadhaar={updateAadhaar} />
                )}
                {currentStep === 4 && (
                  <StepPassword formData={formData} updateForm={updateForm} />
                )}
                {currentStep === 5 && (
                  <StepReview formData={formData} detailsFormData={detailsFormData} riskSignals={riskSignals} goToStep={goToStep} />
                )}
                {currentStep === 6 && (
                  <StepResult
                    riskLabel={formData.riskLabel}
                    plan={formData.recommendedPlan}
                    details={detailsFormData}
                    riskSignals={riskSignals}
                  />
                )}
              </div>

              {/* ── Action buttons ─────────────────────────────────────── */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100/60">
                {currentStep > 1 && currentStep < 6 ? (
                  <button
                    onClick={handleBack}
                    className="text-[15px] font-bold text-slate-400 hover:text-slate-700 px-2 py-2 transition-colors"
                  >
                    Back
                  </button>
                ) : <div />}

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinalAction}
                  disabled={loading}
                  className={`
                    font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 group ml-auto
                    disabled:opacity-75 disabled:cursor-not-allowed min-w-[160px]
                    ${isResultStep
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-900 hover:bg-black text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)]'
                    }
                  `}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-[2.5px] border-white/20 border-t-white rounded-full animate-spin" />
                  ) : buttonLabel()}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold tracking-widest uppercase">
            <Lock size={12} className="text-slate-300" /> Secure SSL Encryption
          </div>
          <div className="flex items-center gap-4 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="text-xs font-bold text-slate-600">IRDAI APPROVED</div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="text-xs font-bold text-slate-600">UIDAI PARTNER</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEPPER COMPONENT
// Never overlaps: full labels on ≥ md, icon + number on mobile.
// ─────────────────────────────────────────────────────────────────────────────

function Stepper({ currentStep, progressPct }) {
  return (
    <div className="w-full mb-10 px-2 sm:px-6 relative" style={{ paddingTop: '4px' }}>

      {/* ── Desktop stepper (≥ 640 px): circles + connector + labels below ── */}
      <div className="hidden sm:block">
        <div className="relative flex items-start justify-between">

          {/* Background track */}
          <div className="absolute left-0 right-0 top-[15px] h-[3px] bg-slate-200 rounded-full z-0 mx-[16px]">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>

          {STEPS.map(step => {
            const isActive    = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center" style={{ flex: '1 1 0' }}>
                {/* Circle */}
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale:           isActive ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#2563EB' : isActive ? '#ffffff' : '#ffffff',
                    borderColor:     (isActive || isCompleted) ? '#2563EB' : '#CBD5E1',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-[3px] shadow-sm
                    ${isActive ? 'ring-4 ring-blue-50 text-blue-600' : isCompleted ? 'text-white' : 'text-slate-400'}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={13} strokeWidth={4} />
                      </motion.div>
                    ) : (
                      <motion.span key="num" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        {step.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label — sits below the circle, does not touch the connector */}
                <div className="mt-2.5 text-center w-full px-0.5">
                  <span className={`
                    block text-[10px] font-bold uppercase tracking-wide leading-tight whitespace-nowrap
                    transition-colors duration-200
                    ${isActive ? 'text-blue-700' : isCompleted ? 'text-slate-500' : 'text-slate-400'}
                  `}>
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile stepper (< 640 px): compact numbered dots + current label ── */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between relative">
          {/* Track */}
          <div className="absolute left-3 right-3 top-[14px] h-[3px] bg-slate-200 rounded-full z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>

          {STEPS.map(step => {
            const isActive    = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale:           isActive ? 1.25 : 1,
                    backgroundColor: isCompleted ? '#2563EB' : isActive ? '#2563EB' : '#E2E8F0',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                >
                  {isCompleted ? (
                    <Check size={13} strokeWidth={4} className="text-white" />
                  ) : (
                    <span className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {step.id}
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Current step label below dots */}
        <div className="mt-3 text-center">
          <span className="text-[12px] font-bold text-blue-700 uppercase tracking-wider">
            Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]?.title}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const FormInput = ({ label, icon: Icon, type = 'text', error, ...props }) => (
  <div>
    <label className="block text-[13px] font-bold text-slate-600 tracking-wide mb-2 pl-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
      )}
      <input
        type={type}
        className={`w-full bg-slate-50 hover:bg-slate-100/50 border rounded-xl py-3.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm shadow-slate-100/50
          ${error ? 'border-red-400 ring-4 ring-red-400/10' : 'border-slate-200/80'}
          ${Icon ? 'pl-[44px]' : 'pl-4'} pr-4`}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-[12px] text-red-500 pl-1 font-medium">{error}</p>}
  </div>
);

const FormSelect = ({ label, icon: Icon, options, placeholder, ...props }) => (
  <div>
    <label className="block text-[13px] font-bold text-slate-600 tracking-wide mb-2 pl-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
      )}
      <select
        className={`w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-xl py-3.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 appearance-none shadow-sm cursor-pointer
          ${Icon ? 'pl-[44px]' : 'pl-4'} pr-9`}
        {...props}
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const StepHeader = ({ icon, title, subtitle }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
    {icon && (
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100/50">
        {icon}
      </div>
    )}
    <h2 className="text-[26px] font-extrabold text-slate-800 mb-2 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 text-[15px] leading-relaxed max-w-xs mx-auto">{subtitle}</p>}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — PHONE + OTP
// ─────────────────────────────────────────────────────────────────────────────

function StepPhone({ formData, updateForm, otpSent }) {
  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...formData.otp];
    next[idx] = clean;
    updateForm('otp', next);
    if (clean && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (!clean && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !formData.otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  return (
    <div>
      <StepHeader
        icon={<Phone size={28} strokeWidth={2} />}
        title="Enter mobile number"
        subtitle="We'll send a 6-digit verification code to confirm your identity."
      />

      <div className="space-y-6 max-w-sm mx-auto">
        {/* Phone input */}
        <div className={`transition-all duration-500 ${otpSent ? 'opacity-50 blur-[2px] pointer-events-none scale-[0.97]' : ''}`}>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 select-none flex items-center gap-1.5">
              <span className="text-[16px]">🇮🇳</span> +91
            </span>
            <input
              type="tel"
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-xl py-4 pl-[88px] pr-4 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xl tracking-wider placeholder:text-slate-300 shadow-sm"
              placeholder="00000 00000"
              maxLength={10}
              value={formData.phone}
              onChange={e => updateForm('phone', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>

        {/* OTP input */}
        {otpSent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
            <label className="block text-[13px] font-bold text-slate-600 text-center tracking-wider mb-4 uppercase">
              Verification Code
            </label>
            <div className="flex gap-2 sm:gap-3 justify-center">
              {formData.otp.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => handleOtpKeyDown(e, i)}
                  className="w-11 h-13 sm:w-12 sm:h-14 bg-white border border-slate-200 rounded-xl text-center text-2xl font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
                  style={{ height: '56px' }}
                />
              ))}
            </div>
            <p className="text-[13px] text-slate-500 mt-6 text-center font-medium">
              Didn't receive code?{' '}
              <span className="text-blue-600 font-bold cursor-pointer hover:underline underline-offset-4">
                Resend OTP
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — USER DETAILS
// ─────────────────────────────────────────────────────────────────────────────

function StepDetails({ formData, setFormData, riskSignals, onCityChanged, loadingSignals }) {
  return (
    <div>
      <StepHeader
        title="Your Details"
        subtitle="This helps us personalise your risk profile and calculate accurate premiums."
      />

      <div className="space-y-5">
        <FormInput
          label="Full Name"
          icon={UserIcon}
          placeholder="As it appears on official documents"
          value={formData.fullName}
          onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="City"
            icon={MapPin}
            placeholder="e.g. Mumbai"
            value={formData.city}
            onChange={async (e) => {
              const nextCity = e.target.value;
              setFormData(prev => ({ ...prev, city: nextCity }));
              await onCityChanged(nextCity);
            }}
          />
          <FormSelect
            label="Platform"
            icon={Briefcase}
            placeholder="Select platform"
            options={PLATFORM_OPTIONS}
            value={formData.platform}
            onChange={e => setFormData(prev => ({ ...prev, platform: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Weekly Hours"
            icon={Clock}
            type="number"
            placeholder="e.g. 48"
            min={0}
            max={168}
            value={formData.weeklyHours}
            onChange={e => setFormData(prev => ({ ...prev, weeklyHours: e.target.value }))}
          />
          <FormInput
            label="Tenure (months)"
            placeholder="e.g. 18"
            type="number"
            min={0}
            value={formData.tenureMonths}
            onChange={e => setFormData(prev => ({ ...prev, tenureMonths: e.target.value }))}
          />
        </div>

        <FormInput
          label="Past Claims"
          placeholder="e.g. 1"
          type="number"
          min={0}
          value={formData.pastClaims}
          onChange={e => setFormData(prev => ({ ...prev, pastClaims: e.target.value }))}
        />

        {/* Live Risk Signals Card */}
        <div className="mt-6 pt-6 border-t border-slate-100">
           {loadingSignals ? (
             <div className="flex items-center gap-3 py-4 text-blue-600 font-bold justify-center bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-sm">Fetching live risk signals...</span>
             </div>
           ) : riskSignals.zoneRisk ? (
             <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Live Risk Signals</h4>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Zone Risk</span>
                    <span className={`text-[15px] font-black ${riskSignals.zoneRisk === 'High' ? 'text-red-400' : 'text-green-400'}`}>
                      {riskSignals.zoneRisk}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Weather Risk</span>
                    <span className="text-[15px] font-black">{riskSignals.weatherRisk}/10</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">AQI Risk</span>
                    <span className="text-[15px] font-black font-mono">{riskSignals.aqiRisk}/10</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Trust Score</span>
                    <span className="text-[15px] font-black text-blue-400">{riskSignals.trustScore}</span>
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-500 mt-5 font-bold tracking-tight">
                  Auto-calculated from location and system signals
                </p>
             </div>
           ) : (
             <div className="text-center py-4 text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Live signals will appear after city selection
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — AADHAAR UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

function UploadCard({ side, preview, fileName, onUpload }) {
  const inputRef = useRef(null);
  const label    = side === 'front' ? 'Aadhaar Front' : 'Aadhaar Back';

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <div>
      <p className="text-[13px] font-bold text-slate-700 mb-3 tracking-wide">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleChange}
      />
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed overflow-hidden transition-all
          ${preview
            ? 'border-blue-400 bg-blue-50/30'
            : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/20'
          }
        `}
        style={{ minHeight: 140 }}
      >
        {preview ? (
          <div className="flex flex-col items-center justify-center p-4 gap-3">
            <img
              src={preview}
              alt={`${side} preview`}
              className="max-h-[110px] rounded-lg object-contain border border-slate-200 shadow-sm"
            />
            <div className="flex items-center gap-2 text-[12px] text-blue-600 font-semibold">
              <Check size={14} strokeWidth={3} /> {fileName}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 gap-3 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-600">Upload {label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or PDF · Max 5 MB</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StepAadhaar({ aadhaar, updateAadhaar }) {
  const handleUpload = (side, file) => {
    const reader = new FileReader();
    reader.onload = ev => {
      if (side === 'front') {
        updateAadhaar('frontFile', file);
        updateAadhaar('frontPreview', ev.target.result);
        updateAadhaar('frontName', file.name);
      } else {
        updateAadhaar('backFile', file);
        updateAadhaar('backPreview', ev.target.result);
        updateAadhaar('backName', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <StepHeader
        icon={<ShieldCheck size={28} strokeWidth={2} />}
        title="Aadhaar Upload"
        subtitle="Upload both sides of your Aadhaar card for KYC verification."
      />

      <div className="space-y-5">
        {/* Security notice */}
        <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-xl p-4">
          <Lock size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-blue-700 leading-relaxed font-medium">
            Your documents are encrypted end-to-end and processed exclusively for IRDAI-mandated KYC.
            {/* TODO: connect to OCR / document verification backend */}
          </p>
        </div>

        {/* Upload cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UploadCard
            side="front"
            preview={aadhaar.frontPreview}
            fileName={aadhaar.frontName}
            onUpload={(file) => handleUpload('front', file)}
          />
          <UploadCard
            side="back"
            preview={aadhaar.backPreview}
            fileName={aadhaar.backName}
            onUpload={(file) => handleUpload('back', file)}
          />
        </div>

        {/* Upload status chips */}
        <div className="flex gap-3">
          {[
            { label: 'Front', done: !!aadhaar.frontFile },
            { label: 'Back',  done: !!aadhaar.backFile  },
          ].map(({ label, done }) => (
            <div key={label} className={`flex items-center gap-2 text-[12px] font-bold px-3 py-1.5 rounded-full
              ${done ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
              {done ? <Check size={12} strokeWidth={3} /> : <FileImage size={12} />}
              {label} {done ? 'Uploaded' : 'Pending'}
            </div>
          ))}
        </div>

        {/* Consent */}
        <label className="flex items-start gap-4 cursor-pointer group bg-slate-50/50 hover:bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all">
          <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              className="peer w-5 h-5 rounded border-2 border-slate-300 appearance-none checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
              checked={aadhaar.consent}
              onChange={e => updateAadhaar('consent', e.target.checked)}
            />
            <Check size={13} className="text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
          </div>
          <span className="text-[13px] text-slate-600 leading-relaxed font-medium group-hover:text-slate-800 transition-colors">
            I authorise Zenvest to process my Aadhaar documents exclusively for policy generation under IRDAI guidelines.
          </span>
        </label>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

function StepPassword({ formData, updateForm }) {
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = [
    { id: 'len',   text: 'At least 8 characters',  isMet: formData.password.length >= 8 },
    { id: 'match', text: 'Passwords match',          isMet: formData.password.length > 0 && formData.password === formData.confirmPassword },
  ];

  return (
    <div>
      <StepHeader
        icon={<Lock size={28} strokeWidth={2} />}
        title="Secure Account"
        subtitle="Set a strong password to protect your policies and payouts."
      />

      <div className="space-y-5">
        {/* Password */}
        <div>
          <label className="block text-[13px] font-bold text-slate-600 tracking-wide mb-2 pl-1">Create Password</label>
          <div className="relative group">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              type={showPwd ? 'text' : 'password'}
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-xl py-3.5 pl-[44px] pr-12 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => updateForm('password', e.target.value)}
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowPwd(v => !v)}>
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[13px] font-bold text-slate-600 tracking-wide mb-2 pl-1">Confirm Password</label>
          <div className="relative group">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              type={showConfirm ? 'text' : 'password'}
              className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-xl py-3.5 pl-[44px] pr-12 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={e => updateForm('confirmPassword', e.target.value)}
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowConfirm(v => !v)}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Strength checklist */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
          {requirements.map(req => (
            <div key={req.id} className="flex items-center gap-3 text-sm">
              <motion.div
                initial={false}
                animate={{ backgroundColor: req.isMet ? '#DCFCE7' : '#F1F5F9', color: req.isMet ? '#16A34A' : '#94A3B8' }}
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Check size={12} strokeWidth={4} />
              </motion.div>
              <span className={`font-semibold transition-colors ${req.isMet ? 'text-slate-800' : 'text-slate-400'}`}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — REVIEW
// ─────────────────────────────────────────────────────────────────────────────

function ReviewSection({ title, stepId, goToStep, children }) {
  return (
    <div className="bg-slate-50/60 border border-slate-200/70 rounded-[16px] p-5 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
        <button
          onClick={() => goToStep(stepId)}
          className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  );
}

function ReviewField({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-[14px] font-bold text-slate-800 truncate">{value || '—'}</p>
    </div>
  );
}

function StepReview({ formData, detailsFormData, riskSignals, goToStep }) {
  const d = detailsFormData;
  const { aadhaar, phone } = formData;

  return (
    <div>
      <StepHeader
        icon={<span className="text-3xl">✨</span>}
        title="Review Details"
        subtitle="Confirm everything is accurate before we compute your risk profile."
      />

      <div className="space-y-4">
        {/* Identity */}
        <ReviewSection title="Identity" stepId={1} goToStep={goToStep}>
          <ReviewField label="Mobile" value={`+91 ${phone}`} />
          <ReviewField label="Name" value={d.fullName} />
        </ReviewSection>

        {/* Work profile */}
        <ReviewSection title="Work Profile" stepId={2} goToStep={goToStep}>
          <ReviewField label="City"          value={d.city} />
          <ReviewField label="Platform"      value={d.platform} />
          <ReviewField label="Weekly Hours"  value={d.weeklyHours ? `${d.weeklyHours} hrs` : ''} />
          <ReviewField label="Tenure"        value={d.tenureMonths ? `${d.tenureMonths} months` : ''} />
          <ReviewField label="Past Claims"   value={d.pastClaims} />
          <ReviewField label="Zone Risk"     value={riskSignals.zoneRisk} />
          <ReviewField label="Weather Risk"  value={riskSignals.weatherRisk ? `${riskSignals.weatherRisk}/10` : ''} />
          <ReviewField label="AQI Risk"      value={riskSignals.aqiRisk ? `${riskSignals.aqiRisk}/10` : ''} />
          <ReviewField label="Trust Score"   value={riskSignals.trustScore} />
        </ReviewSection>

        {/* Documents */}
        <ReviewSection title="Documents & Account" stepId={3} goToStep={goToStep}>
          <ReviewField label="Aadhaar Front" value={aadhaar.frontFile ? `✅ ${aadhaar.frontName}` : '⚠ Not uploaded'} />
          <ReviewField label="Aadhaar Back"  value={aadhaar.backFile  ? `✅ ${aadhaar.backName}`  : '⚠ Not uploaded'} />
          <ReviewField label="Password"      value={formData.password ? '●●●●●●●●' : 'Not set'} />
        </ReviewSection>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — RESULT
// ─────────────────────────────────────────────────────────────────────────────

function StepResult({ riskLabel, plan, details, riskSignals }) {
  const meta = getRiskMeta(riskLabel);

  if (!riskLabel || !plan) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-sm"
          style={{ backgroundColor: meta.bg }}>
          🎯
        </div>
        <h2 className="text-[26px] font-extrabold text-slate-800 mb-2 tracking-tight">Your Risk Profile</h2>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-xs mx-auto">
          Based on your profile, here's your personalised insurance recommendation.
        </p>
      </motion.div>

      {/* Risk label card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[18px] p-6 mb-5 border"
        style={{ backgroundColor: meta.bg, borderColor: meta.color + '40' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: meta.color }}>
              Risk Classification
            </p>
            <p className="text-[32px] font-extrabold tracking-tight" style={{ color: meta.color }}>
              {riskLabel} Risk
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: meta.color + '20' }}>
            <ShieldCheck size={32} style={{ color: meta.color }} strokeWidth={2} />
          </div>
        </div>

        {/* Mini factor pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: 'Zone',    value: riskSignals?.zoneRisk },
            { label: 'Weather', value: riskSignals?.weatherRisk ? `${riskSignals.weatherRisk}/10` : '' },
            { label: 'AQI',     value: riskSignals?.aqiRisk ? `${riskSignals.aqiRisk}/10` : '' },
          ].filter(f => f.value).map(f => (
            <span key={f.label} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: meta.color + '18', color: meta.color }}>
              {f.label}: {f.value}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Recommended plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 text-white rounded-[18px] p-6 relative overflow-hidden"
      >
        {/* Subtle glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: meta.color, filter: 'blur(40px)' }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Plan</span>
              <h3 className="text-[22px] font-extrabold mt-1">{plan.name}</h3>
              <p className="text-slate-400 text-[13px] mt-0.5">{plan.tagline}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-[22px] font-extrabold text-white">{plan.premium}</p>
              <p className="text-slate-400 text-[12px]">Coverage: {plan.coverage}</p>
            </div>
          </div>

          <ul className="space-y-2 mt-4">
            {plan.features.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-slate-300">
                <Check size={14} className="text-green-400 flex-shrink-0" strokeWidth={3} /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[12px] text-slate-400 font-medium">
              🏅 {plan.badge}
            </span>
            <span className="text-[12px] text-slate-400 font-medium">
              Hit "Go to Dashboard" to activate →
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
