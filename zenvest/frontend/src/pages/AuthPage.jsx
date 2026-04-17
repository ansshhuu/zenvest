import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldAlert } from 'lucide-react';
import RoleSelector from '../components/RoleSelector';
import RiderSignInForm from '../components/RiderSignInForm';
import AdminSignInForm from '../components/AdminSignInForm';
import RiderRegisterForm from '../components/RiderRegisterForm';
import AdminRegisterForm from '../components/AdminRegisterForm';

export default function AuthPage({ navigate, showToast }) {
  const [activeTab, setActiveTab] = useState("signin");
  const [role, setRole] = useState("rider");

  const handleSignIn = (formData) => {
    // formData for rider: { phone, password }
    // formData for admin: { identifier, password }
    
    if (role === "rider") {
        if (!formData.phone || formData.phone.length < 10) { 
            showToast("Please enter a valid 10-digit number", "error"); 
            return; 
        }
        navigate("dashboard"); 
        showToast("Welcome back! 👋", "success"); 
    } else {
        // Mock admin sign in
        navigate("admin"); 
        showToast("Welcome, Admin!", "success"); 
    }
  };

  const handleAdminRegister = (formData) => {
    // formData: { fullName, username, email, password, inviteCode }
    console.log("Admin Registration:", formData);
    showToast("Admin account created! Contact IT for activation.", "success");
    setActiveTab("signin");
  };

  const isRider = role === "rider";
  const isSignIn = activeTab === "signin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #f8fafc, #eff6ff)" }}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-48 -right-24 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="flex justify-center mb-8 cursor-pointer" onClick={() => navigate("home")}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
              Zenvest
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 border border-gray-100 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignIn ? 'Welcome back' : isRider ? 'Join Zenvest' : 'Staff Enrollment'}
            </h2>
            <p className="text-sm text-gray-500">
                {isSignIn 
                    ? `Sign in to your ${role} account` 
                    : isRider ? 'Create your rider account' : 'Create your admin account'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8 relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${activeTab === 'signin' ? 'left-1' : 'left-[calc(50%+3px)]'}`}
            />
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors relative z-10 ${activeTab === 'signin' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors relative z-10 ${activeTab === 'register' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>

          {/* Role Selection (Shared) */}
          <div className="mb-8">
            <RoleSelector role={role} setRole={setRole} />
          </div>

          {/* Contextual Form Rendering */}
          <div className="transition-all duration-300">
            {isSignIn ? (
                // SIGN IN FLOW
                isRider ? (
                    <RiderSignInForm onSubmit={handleSignIn} />
                ) : (
                    <AdminSignInForm onSubmit={handleSignIn} />
                )
            ) : (
                // REGISTER FLOW
                isRider ? (
                    <RiderRegisterForm navigate={navigate} />
                ) : (
                    <AdminRegisterForm onSubmit={handleAdminRegister} />
                )
            )}
          </div>
          
          {/* Internal Note for Admins */}
          {!isRider && (
            <div className="mt-8 flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
              <ShieldAlert className="w-4 h-4 text-indigo-600 mt-0.5" />
              <p className="text-[11px] text-indigo-700 leading-normal">
                Admin access is restricted to authorized Zenvest team members. Credentials are monitored.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
