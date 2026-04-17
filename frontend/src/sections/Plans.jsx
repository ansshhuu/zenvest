import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { plans } from '../constants/plansData';
import PlanCard from '../components/cards/PlanCard';

export default function Plans({ navigate }) {
  const [billingCycle, setBillingCycle] = useState('weekly');

  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFF] overflow-hidden" id="plans">
      <div className="container max-w-[1100px] px-6">
        <div className="text-center mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[13px] font-bold tracking-wide uppercase mb-4"
          >
            <ShieldCheck size={14} />
            Plans & Pricing
          </motion.div>
          <h2 className="text-[32px] sm:text-[42px] font-black text-slate-900 tracking-tight leading-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-[16px] sm:text-[18px] max-w-[540px] mx-auto leading-relaxed">
            No hidden charges. No waiting periods. Pick a plan and get covered starting this Sunday.
          </p>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-[14px] font-bold ${billingCycle === 'weekly' ? 'text-slate-900' : 'text-slate-400'}`}>Weekly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'weekly' ? 'monthly' : 'weekly')}
              className="w-14 h-7 rounded-full bg-slate-200 p-1 relative transition-colors hover:bg-slate-300"
            >
              <motion.div 
                animate={{ x: billingCycle === 'weekly' ? 0 : 28 }}
                className="w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
            <span className={`text-[14px] font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Monthly <span className="text-blue-500 text-[11px] font-black uppercase tracking-tighter ml-1">Save 10%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, i) => (
            <PlanCard 
              key={p.id} 
              plan={p} 
              index={i} 
              billingCycle={billingCycle} 
              onCtaClick={() => navigate("register")} 
            />
          ))}
        </div>

        {/* Social Proof Mini */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Regulated & Trusted by</div>
          <div className="flex items-center gap-2 font-black text-slate-600 text-[18px]">IRDAI</div>
          <div className="flex items-center gap-2 font-black text-slate-600 text-[18px]">Swiggy</div>
          <div className="flex items-center gap-2 font-black text-slate-600 text-[18px]">Zomato</div>
        </div>
      </div>
    </section>
  );
}
