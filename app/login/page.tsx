'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/store';

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect');
  const setUser      = useAuth(state => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [formData,     setFormData]     = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Invalid email or password');
        return;
      }

      const redirectMap: Record<string, string> = {
        admin: '/admin',
        agent: '/agent/dashboard',
        buyer: '/',
      };

      // ✅ Instantly populate store — no re-fetch needed, no black flash
      setUser(data.user);

      const destination = redirectMap[data.user?.role ?? ''] ?? redirect ?? '/';
      router.replace(destination);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .login-wrap {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #f5f0e8;
        }

        .hero-panel {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #1a1208;
          display: none;
        }
        @media (min-width: 1024px) { .hero-panel { display: flex; flex-direction: column; justify-content: flex-end; } }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(15,8,2,0.35) 0%, rgba(15,8,2,0.75) 100%),
            url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80') center/cover no-repeat;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 48px 52px;
        }
        .hero-tag {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.4);
          padding: 6px 14px;
          margin-bottom: 20px;
        }
        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          font-weight: 400;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 16px;
        }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
          margin: 0;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #c9a84c;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .form-panel {
          width: 100%;
          max-width: 480px;
          background: #faf7f2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
          position: relative;
          border-left: 1px solid #e8e0d0;
        }

        .logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        .logo-box {
          width: 34px;
          height: 34px;
          background: #1a1208;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-box span {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.08em;
        }
        .logo-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1a1208;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .heading-block { margin-bottom: 28px; }
        .heading-block h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: #1a1208;
          margin: 0 0 6px;
          line-height: 1.15;
        }
        .heading-block h1 em { color: #b8892e; font-style: italic; }
        .heading-block p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #8a7c6a;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(220,38,38,0.06);
          border: 1px solid rgba(220,38,38,0.18);
          border-radius: 2px;
          margin-bottom: 20px;
        }
        .error-box p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #dc2626;
          margin: 0;
        }

        .field { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a7c6a;
          margin-bottom: 6px;
        }
        .field-input {
          width: 100%;
          background: #fff;
          border: 1px solid #ddd5c4;
          border-radius: 2px;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #1a1208;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .field-input::placeholder { color: #c2b8a8; }
        .field-input:focus { border-color: #b8892e; box-shadow: 0 0 0 3px rgba(184,137,46,0.1); }
        .field-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
          -webkit-text-fill-color: #1a1208 !important;
        }

        .pw-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .forgot-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #b8892e;
          text-decoration: none;
          letter-spacing: 0.04em;
        }
        .forgot-link:hover { text-decoration: underline; }

        .pw-wrap { position: relative; }
        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a89880;
          padding: 0;
          display: flex;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #1a1208;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          margin-top: 4px;
          margin-bottom: 16px;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.12) 100%);
        }
        .submit-btn:hover:not(:disabled) { background: #2c2010; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .remember-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .custom-check {
          width: 15px;
          height: 15px;
          border: 1px solid #c2b8a8;
          border-radius: 2px;
          flex-shrink: 0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }
        .remember-row:hover .custom-check { border-color: #b8892e; }
        .remember-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: #8a7c6a;
          letter-spacing: 0.03em;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .divider-line { flex: 1; height: 1px; background: #e4dace; }
        .divider-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #b0a090;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .register-row {
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #8a7c6a;
          margin: 0;
        }
        .register-row a { color: #b8892e; text-decoration: none; font-weight: 500; }
        .register-row a:hover { text-decoration: underline; }

        .top-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #b8892e, #e8c96a, #b8892e);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      <div className="login-wrap">
        {/* Hero panel */}
        <div className="hero-panel">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-tag">Alfima Realty Inc.</div>
            <h2 className="hero-headline">
              Premium Properties<br />
              <em style={{ fontStyle: 'italic', color: '#c9a84c' }}>Across the Philippines</em>
            </h2>
            <p className="hero-sub">Your trusted partner in luxury real estate</p>
            <div className="hero-stats">
              <div>
                <div className="stat-num">500+</div>
                <div className="stat-label">Agents</div>
              </div>
              <div>
                <div className="stat-num">12K+</div>
                <div className="stat-label">Listings</div>
              </div>
              <div>
                <div className="stat-num">8</div>
                <div className="stat-label">Regions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="form-panel">
          <div className="top-accent" />

          <div className="fade-up">
            {/* Logo */}
            <div className="logo-row">
              <div className="logo-box"><span>RE</span></div>
              <span className="logo-text">RealEstate</span>
            </div>

            {/* Heading */}
            <div className="heading-block">
              <h1>Welcome <em>back.</em></h1>
              <p>Sign in to access your account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <AlertCircle size={14} color="#dc2626" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field">
                <label className="field-label">Email Address</label>
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="field">
                <div className="pw-row">
                  <label className="field-label" style={{ margin: 0 }}>Password</label>
                  <Link href="/forgot-password" className="forgot-link">Forgot?</Link>
                </div>
                <div className="pw-wrap">
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Remember me */}
              <label className="remember-row">
                <div className="custom-check">
                  <input type="checkbox" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                </div>
                <span className="remember-label">Keep me signed in</span>
              </label>
            </form>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            {/* Register */}
            <p className="register-row">
              Don't have an account?{' '}
              <Link href="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}