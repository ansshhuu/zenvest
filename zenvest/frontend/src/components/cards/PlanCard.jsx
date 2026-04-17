import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, ArrowRight } from 'lucide-react';

export default function PlanCard({ plan, billingCycle, onCtaClick, index }) {
  const isRecommended = plan.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 + 0.1 }}
      whileHover={{ y: -8 }}
      className={`flex flex-col relative rounded-[28px] p-8 sm:p-10 bg-white transition-all
        ${isRecommended 
          ? 'ring-[3px] ring-blue-500/20 shadow-[0_32px_80px_-20px_rgba(37,99,235,0.18)] scale-105 z-10' 
          : 'border border-slate-100 shadow-[0_8px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.12)]'
        }
      `}
    >
      {isRecommended && (
        <div className="absolute top-0 right-10 -translate-y-1/2">
          <div className="bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg">
            {plan.badge}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-[22px] font-black text-slate-800 mb-1">{plan.name}</h3>
        <p className="text-slate-400 text-[13px] font-medium leading-relaxed">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[36px] sm:text-[44px] font-black text-slate-900 tracking-tighter">
            ₹{billingCycle === 'weekly' ? plan.price : Math.round(plan.price * 4 * 0.9)}
          </span>
          <span className="text-slate-400 text-[14px] font-bold">/{billingCycle === 'weekly' ? 'week' : 'month'}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[12px] font-black uppercase tracking-tight mt-3">
          <ShieldCheck size={14} strokeWidth={3} />
          {plan.coverage} Cover
        </div>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-3.5 text-[14px] text-slate-600 font-medium">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={11} className="text-blue-600" strokeWidth={4} />
            </div>
            <span className={f.includes('Everything in') ? 'font-bold text-slate-800' : ''}>{f}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onCtaClick}
        className={`group w-full py-4 rounded-xl font-black text-[15px] transition-all flex items-center justify-center gap-2
          ${isRecommended 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.4)]' 
            : 'bg-slate-900 text-white hover:bg-black'
          }
        `}
      >
        {plan.cta}
        <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
