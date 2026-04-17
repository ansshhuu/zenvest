import React, { useState } from 'react';
import { Eye, EyeOff, Smartphone, Lock } from 'lucide-react';

export default function SignInForm({ onSubmit, navigate }) {
  const [form, setForm] = useState({
    phone: '',
    password: ''
  });
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center bg-gray-50 rounded-l-xl border border-gray-200 border-r-0 text-gray-500 text-sm font-medium">
              🇮🇳 +91
            </div>
            <input
              type="tel"
              placeholder="98765 43210"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              className="w-full h-12 pl-20 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 group-hover:border-blue-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-12 pl-12 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 group-hover:border-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Sign in
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 bg-white px-2">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <button
        type="button"
        onClick={() => navigate("register")}
        className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
      >
        <Smartphone className="w-4 h-4" />
        Continue with OTP
      </button>
    </form>
  );
}
