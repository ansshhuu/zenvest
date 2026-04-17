import React from 'react';
import Logo from './Logo';

export default function AppHeader({ navigate, avatarLetter, activePage = 'dashboard' }) {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home',     page: 'dashboard', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, extra: <polyline points="9 22 9 12 15 12 15 22" /> },
    { id: 'triggers',  label: 'Triggers', page: 'triggers',  icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
    { id: 'claims',    label: 'Claims',   page: 'claims',    icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
  ];

  return (
    <header className="h-[64px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer group flex-shrink-0" onClick={() => navigate("home")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-extrabold text-[20px] tracking-tight text-slate-800">Zenvest</span>
      </div>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.page)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                {item.icon}{item.extra}
              </svg>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-600">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <button
          onClick={() => navigate('profile')}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-[14px] shadow-md hover:shadow-blue-300 transition-shadow"
        >
          {avatarLetter ?? "?"}
        </button>
      </div>
    </header>
  );
}
