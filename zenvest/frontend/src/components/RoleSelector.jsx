import React from 'react';
import { Bike, ShieldBan } from 'lucide-react';

export default function RoleSelector({ role, setRole }) {
  const roles = [
    {
      id: 'rider',
      title: 'Rider',
      desc: 'Access your protection, claims, and payouts',
      icon: Bike,
      activeColor: 'text-blue-600',
      activeBg: 'bg-blue-50 border-blue-500',
      activeShadow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]'
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Manage policies, triggers, and analytics',
      icon: ShieldBan,
      activeColor: 'text-indigo-600',
      activeBg: 'bg-indigo-50 border-indigo-500',
      activeShadow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Continue as
      </div>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((r) => {
          const isActive = role === r.id;
          const Icon = r.icon;
          
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border text-center
                transition-all duration-200 ease-in-out cursor-pointer group hover:-translate-y-0.5
                ${isActive 
                  ? `border-2 ${r.activeBg} ${r.activeShadow}` 
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50'}
              `}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className={`w-2 h-2 rounded-full ${r.activeColor.replace('text', 'bg')} animate-pulse`} />
                </div>
              )}
              
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors
                ${isActive ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}
              `}>
                <Icon className={`w-5 h-5 ${isActive ? r.activeColor : 'text-gray-400 group-hover:text-blue-500'}`} />
              </div>
              
              <div className={`font-semibold text-sm mb-1 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                {r.title}
              </div>
              <div className={`text-[10px] leading-snug ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                {r.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
