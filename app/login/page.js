'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GithubIcon from '@/components/GithubIcon';
import { Shield, ArrowRight, CheckCircle2, LogOut, UserCheck, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [githubUsername, setGithubUsername] = useState('aarav_dev');
  const [redditUsername, setRedditUsername] = useState('aarav_dev');
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setAuthenticated(data.authenticated);
      if (data.user) {
        setUser(data.user);
        setGithubUsername(data.user.github_username || '');
        setRedditUsername(data.user.reddit_username || '');
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          github_username: githubUsername,
          reddit_username: redditUsername
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        setUser(data.user);
        router.push('/risk-report');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(false);
        setUser(null);
        setGithubUsername('');
        setRedditUsername('');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-brand-orange/20 selection:text-brand-orange pt-20">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 py-16">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-orange shadow-md">
              <Shield className="w-8 h-8 text-brand-orange" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {authenticated ? 'Linked Account Settings' : 'Sign In & Link Accounts'}
            </h1>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              Link your individual GitHub and Reddit handles for self-privacy exposure auditing.
            </p>
          </div>

          {authenticated && user ? (
            /* Signed In Active Session View */
            <div className="mt-8 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                <img
                  src={user.avatar_url || `https://github.com/${user.github_username}.png`}
                  alt={user.github_username}
                  className="w-14 h-14 rounded-2xl border-2 border-brand-orange object-cover shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">{user.name}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-mono">
                      <UserCheck className="w-3 h-3" /> Signed In
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    GitHub: <span className="text-slate-900 font-bold">@{user.github_username}</span> | Reddit: <span className="text-slate-900 font-bold">u/{user.reddit_username}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/risk-report')}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-3 shadow-glow hover:shadow-glow-lg text-sm tracking-wide"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>Run Privacy Audit for Linked Accounts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-sm border border-slate-200"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Link Handles Form */
            <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                  GitHub Handle
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-mono text-sm">@</span>
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. octocat or your GitHub username"
                    className="w-full py-3.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Linked Reddit Handle
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-mono text-sm">u/</span>
                  <input
                    type="text"
                    required
                    value={redditUsername}
                    onChange={(e) => setRedditUsername(e.target.value)}
                    placeholder="e.g. aarav_dev or your Reddit handle"
                    className="w-full py-3.5 pl-9 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live data will be fetched directly for the linked accounts.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You can Sign Out or change handles at any time.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-3 shadow-glow hover:shadow-glow-lg text-sm tracking-wide"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <GithubIcon className="w-5 h-5 fill-current" />
                    <span>Sign In & Link Accounts</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-6 font-medium">
            Self-privacy exposure audit strictly operates on user-linked accounts.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
