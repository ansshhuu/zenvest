import React from 'react';

export default function Logo({ onClick }) {
  return (
    <div className="nav-logo" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      Zenvest
    </div>
  );
}
