/**
 * AnalysisLoaderPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown immediately after onboarding submission while the AI analysis runs.
 * Reads formData from appState, calls analyzeProfile(), then navigates to
 * the risk-result page with the API response.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile } from '../services/analysisService.js';

const LOADER_MESSAGES = [
  { text: 'Reading your work profile…',        icon: '👤' },
  { text: 'Analysing zone exposure…',           icon: '📍' },
  { text: 'Calculating weather risk…',          icon: '🌧️' },
  { text: 'Running AI risk model…',             icon: '🤖' },
  { text: 'Evaluating trust score…',            icon: '⭐' },
  { text: 'Selecting optimal plans…',           icon: '🛡️' },
  { text: 'Finalising your risk report…',       icon: '✅' },
];

export default function AnalysisLoaderPage({ navigate, appState, setAppState, showToast }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress,  setProgress] = useState(0);
  const [error,     setError]    = useState(null);

  useEffect(() => {
    // Cycle through loader messages
    const msgTimer = setInterval(() => {
      setMsgIndex(i => Math.min(i + 1, LOADER_MESSAGES.length - 1));
    }, 400);

    // Smooth progress bar
    const progTimer = setInterval(() => {
      setProgress(p => Math.min(p + 1.6, 95)); // stops at 95 until response
    }, 45);

    // Run the actual analysis
    const onboardingData = appState.pendingOnboarding;
    if (!onboardingData) {
      // Guard: if called without data (e.g. direct navigation), bounce back
      navigate('register');
      return;
    }

    analyzeProfile(onboardingData)
      .then(result => {
        clearInterval(msgTimer);
        clearInterval(progTimer);
        setProgress(100);

        // Store result in app state for the result page
        setAppState(s => ({
          ...s,
          analysisResult: result,
          user: {
            ...(s.user || {}),
            name:            onboardingData.userDetails?.name,
            phone:           onboardingData.phone,
            city:            onboardingData.userDetails?.city,
            platform:        [onboardingData.userDetails?.platform?.toLowerCase()],
            hours:           Number(onboardingData.userDetails?.weeklyHours),
            aadhaarVerified: true,
            riskLabel:       result.riskLabel,
            trustScore:      result.trustScore,
          },
        }));

        setTimeout(() => navigate('risk-result'), 400);
      })
      .catch(err => {
        clearInterval(msgTimer);
        clearInterval(progTimer);
        setError(err.message || 'Analysis failed. Please try again.');
      });

    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentMsg = LOADER_MESSAGES[msgIndex];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-[80px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {error ? (
          /* ── Error state ── */
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
          >
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">❌</div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Analysis Failed</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('register')}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => { setError(null); setProgress(0); setMsgIndex(0); }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Loading state ── */
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm text-center"
          >
            {/* Pulsing logo */}
            <div className="relative mx-auto mb-10" style={{ width: 88, height: 88 }}>
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-22 h-22 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-[22px] flex items-center justify-center shadow-[0_12px_40px_rgba(37,99,235,0.35)] mx-auto"
                style={{ width: 88, height: 88 }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </motion.div>
              {/* Orbiting ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
                style={{ width: 88, height: 88 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-blue-400 rounded-full" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
              Analysing your profile
            </h2>

            {/* Animated message */}
            <div className="h-8 mb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-500 text-[15px] font-medium"
                >
                  <span className="mr-2">{currentMsg.icon}</span>
                  {currentMsg.text}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[12px] text-slate-400 font-bold tracking-wide">
              {Math.round(progress)}% complete
            </p>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-8">
              {LOADER_MESSAGES.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: i === msgIndex ? 1.4 : 1, opacity: i <= msgIndex ? 1 : 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                />
              ))}
            </div>

            <p className="text-[12px] text-slate-400 mt-8 font-medium">
              🔒 Your data is encrypted and never sold to third parties.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
