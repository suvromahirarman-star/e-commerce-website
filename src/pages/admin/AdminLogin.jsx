import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@aurastudio.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}`, 'success');
        navigate('/admin');
      } else {
        showToast(res.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      showToast('Login attempt failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-display tracking-widest text-white">
            AURA
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider bg-[#FF6B2C] text-white px-2 py-0.5 rounded-full font-semibold">
            Admin Portal
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Return to Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] mx-auto flex items-center justify-center text-[#FF6B2C]">
            <Lock className="w-6 h-6 text-[#FF6B2C]" />
          </div>
          <h1 className="text-2xl font-bold font-display text-neutral-950">
            Atelier Management Sign-In
          </h1>
          <p className="text-xs text-neutral-500 font-sans">
            Restricted access for store managers, inventory supervisors, and dispatch leads.
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="p-3.5 rounded-2xl bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-mono text-[#C94716] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <KeyRound className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>Pre-Filled Demo Access</span>
          </div>
          <div className="text-[11px] text-[#A64A25]">
            Email: <strong>admin@aurastudio.com</strong> | Pass: <strong>admin123</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
              Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#FF6B2C] hover:bg-[#E9571F] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Access Management Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session Protocol</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-mono text-neutral-500">
        © 2026 AURA Studio. Internal Operating Architecture.
      </div>
    </div>
  );
}
export default AdminLogin;
