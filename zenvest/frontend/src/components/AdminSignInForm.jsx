import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function AdminSignInForm({ onSubmit }) {
  const [form, setForm] = useState({
    identifier: '', // Username or Email
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Username or Work Email</label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="admin.name or work@zenvest.com"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 group-hover:border-blue-300"
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
              placeholder="Enter your admin password"
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
          Forgot admin password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Admin Sign In
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
      
      <div className="text-center">
        <p className="text-[11px] text-gray-400 bg-gray-50/50 py-2 rounded-lg border border-dashed border-gray-200">
          Admin access is restricted to authorized team members only.
        </p>
      </div>
    </form>
  );
}
