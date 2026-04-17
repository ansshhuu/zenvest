import React from 'react';
import Logo from './Logo';

export default function RegisterHeader({ navigate, right }) {
  return (
    <div className="register-header">
      <Logo onClick={() => navigate("home")} />
      {right}
    </div>
  );
}
