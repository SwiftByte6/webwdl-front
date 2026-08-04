'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Validate single field
  const validateField = (field, value) => {
    let error = '';
    if (field === 'email') {
      if (!value.trim()) {
        error = 'Email or Handle is required';
      } else if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      } else if (value.trim().length < 3) {
        error = 'Must be at least 3 characters long';
      }
    }

    if (field === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    }

    return error;
  };

  // Handle Input Changes with Real-time Validation
  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle Blur
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'email' ? email : password;
    const error = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ email: true, password: true });

    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    // Clear errors & trigger submitting
    setErrors({});
    setIsSubmitting(true);

    // Simulate API Auth call
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      
      {/* Top Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4 text-brand-orange" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Minimalist Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-brand-orange to-amber-500" />

        {/* Card Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-brand-orange mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            Enter your credentials to access your Deanonymizer audit dashboard
          </p>
        </div>

        {/* Success Alert */}
        {loginSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">Authentication Successful!</h3>
              <p className="text-xs text-emerald-700 mt-1">Redirecting to your privacy audit dashboard...</p>
            </div>
            <Link
              href="/"
              className="inline-block mt-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover px-4 py-2 rounded-xl transition-all shadow-md"
            >
              Continue to Dashboard
            </Link>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            
            {/* Email / Username Input Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                Email or Handle
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@example.com or @handle"
                  className={`w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono ${
                    touched.email && errors.email
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : touched.email && !errors.email && email
                      ? 'border-emerald-300 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-200 focus:border-brand-orange focus:bg-white'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Input Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 font-mono">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been sent to your registered email.');
                  }}
                  className="text-[11px] font-semibold text-brand-orange hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono ${
                    touched.password && errors.password
                      ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : touched.password && !errors.password && password
                      ? 'border-emerald-300 focus:border-emerald-500 focus:bg-white'
                      : 'border-slate-200 focus:border-brand-orange focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange accent-brand-orange border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

          </form>
        )}

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Registration is currently open for Vidyalankar Institute students and faculty.');
            }}
            className="font-bold text-brand-orange hover:underline"
          >
            Create an account
          </a>
        </div>

      </div>

      {/* Page Footer Text */}
      <div className="mt-8 text-center text-xs text-slate-400 font-mono">
        Deanonymizer Engine v1.0.4 • Vidyalankar Institute of Technology
      </div>

    </div>
  );
}
