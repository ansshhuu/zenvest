import React from 'react';
import { Bike, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RiderRegisterForm({ navigate }) {
  return (
    <div className="space-y-6 py-4">
      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 text-center">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center mx-auto mb-4">
          <Bike className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Create your rider account</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Join 15,000+ delivery partners who are protected against rain, accidents, and income loss.
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-left p-3 bg-white rounded-xl border border-blue-100/50 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
                <div className="text-xs font-bold text-gray-800">Parametric Protection</div>
                <div className="text-[10px] text-gray-500 text-nowrap">Auto-payouts when it rains. No claims.</div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate("register")} 
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Start Rider Onboarding
        <ArrowRight className="w-4 h-4" />
      </button>
      
      <p className="text-[11px] text-center text-gray-400">
        Registration is 100% digital and takes less than 5 minutes.
      </p>
    </div>
  );
}
