import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Shield,
  Layers,
  TrendingUp,
  Cpu,
  Globe,
  Loader2
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginId.trim()) {
      const msg = 'Please enter your Login ID or Email';
      setErrorMsg(msg);
      showToast(msg, 'error');
      return;
    }

    if (!password) {
      const msg = 'Please enter your Password';
      setErrorMsg(msg);
      showToast(msg, 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Execute REAL HTTP request to POST /api/auth/login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId, password })
      });

      if (!response.ok) {
        throw new Error(`API Endpoint /api/auth/login returned HTTP ${response.status} (${response.statusText || 'Not Found'}).`);
      }

      const resData = await response.json();

      if (resData && (resData.success || resData.data)) {
        if (resData.data?.user) {
          sessionStorage.setItem('avyoma_user', JSON.stringify(resData.data.user));
        } else {
          sessionStorage.setItem('avyoma_user', JSON.stringify({ id: 'USR-001', email: loginId }));
        }

        if (resData.data?.organization) {
          sessionStorage.setItem('avyoma_organization', JSON.stringify(resData.data.organization));
        }

        showToast('Login successful! Redirecting to Dashboard...', 'success');
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        const errorText = resData.message || 'Authentication failed. Invalid credentials.';
        setErrorMsg(errorText);
        showToast(errorText, 'error');
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      const failureMessage = err.message || 'Failed to connect to POST /api/auth/login backend API.';
      setErrorMsg(failureMessage);
      showToast(failureMessage, 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#060B17',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(0, 180, 216, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.8) 0%, #060B17 100%)
      `,
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      fontFamily: 'var(--font-sans, "Plus Jakarta Sans", -apple-system, sans-serif)',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. Subtle Technology Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* 2. Futuristic Orbital Curves & SVG Light Effects */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.4
      }}>
        <defs>
          <linearGradient id="orbitalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00B4D8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="20%" cy="30%" r="400" fill="none" stroke="url(#orbitalGlow)" strokeWidth="1.5" strokeDasharray="8 6" />
        <circle cx="20%" cy="30%" r="580" fill="none" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="1" />
        <path d="M-100,200 Q400,100 800,600 T1800,400" fill="none" stroke="rgba(0, 180, 216, 0.12)" strokeWidth="1.5" />
      </svg>

      {/* 3. Technology Skyline Silhouette at Bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '180px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(6, 11, 23, 0.95) 80%, #060B17 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        <svg style={{ width: '100%', height: '100%', opacity: 0.15 }} preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,120 L0,90 L40,90 L40,70 L70,70 L70,90 L120,90 L120,40 L160,40 L160,90 L220,90 L220,60 L270,60 L270,90 L340,90 L340,30 L390,30 L390,90 L460,90 L460,50 L520,50 L520,90 L600,90 L600,20 L660,20 L660,90 L740,90 L740,65 L800,65 L800,90 L880,90 L880,45 L940,45 L940,90 L1020,90 L1020,35 L1080,35 L1080,90 L1200,90 L1200,120 Z" fill="#3B82F6" />
        </svg>
      </div>

      {/* 4. Floating Toast Notification Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '28px',
          right: '28px',
          zIndex: 1000,
          background: toast.type === 'error' ? 'rgba(220, 38, 38, 0.92)' : 'rgba(16, 185, 129, 0.92)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 5. Top Header Strip */}
      <header style={{
        padding: '28px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '22px',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            letterSpacing: '-0.02em'
          }}>
            A
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '0.08em',
              lineHeight: 1.1
            }}>
              AVYOMA
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#64748B',
              letterSpacing: '0.14em',
              textTransform: 'uppercase'
            }}>
              ENTERPRISE PLATFORM
            </div>
          </div>
        </div>

        {/* Top Right Tagline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#64748B',
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
          }} />
          <span>BUILT FOR A STRONGER TOMORROW</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: '#94A3B8' }}>v2.4 SECURE</span>
        </div>
      </header>

      {/* 6. Main Split Screen Body */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 48px 60px 48px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '60px',
          alignItems: 'center'
        }}>

          {/* LEFT SIDE: Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Small Category Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60A5FA',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              width: 'fit-content'
            }}>
              <Cpu size={14} />
              <span>AVYOMA ENTERPRISE SUITE</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 54px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: 0
            }}>
              Everything your<br />
              business <span style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #00B4D8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>needs.</span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '480px',
              margin: 0,
              fontWeight: 400
            }}>
              Next-generation defence & commercial enterprise operations platform. Unified CRM, General Ledger, Accounts Receivable/Payable, and real-time execution analytics in one connected workspace.
            </p>

            {/* Feature Blocks Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '12px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {/* Feature 01 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6' }}>
                  <Shield size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>01</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>SECURE</div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.3 }}>Enterprise-grade encryption</div>
              </div>

              {/* Feature 02 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00B4D8' }}>
                  <Layers size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>02</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>UNIFIED</div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.3 }}>One connected workspace</div>
              </div>

              {/* Feature 03 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                  <TrendingUp size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>03</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>GROWTH</div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.3 }}>Scalable ERP engine</div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Glassmorphism Login Panel */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '440px',
              background: 'rgba(12, 20, 39, 0.78)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '24px',
              padding: '42px 38px',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              position: 'relative'
            }}>
              
              {/* Login Header */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  margin: '0 0 8px 0'
                }}>
                  Welcome back
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#94A3B8',
                  margin: 0,
                  fontWeight: 500
                }}>
                  Sign in to your AVYOMA workspace.
                </p>
              </div>

              {/* API Failure Alert */}
              {errorMsg && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#FCA5A5',
                  fontSize: '13px',
                  lineHeight: 1.4
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Login ID Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#CBD5E1',
                    marginBottom: '8px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Login ID or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748B'
                    }} />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="admin@avyoma.com"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3B82F6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#CBD5E1',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        fontSize: '12px',
                        color: '#60A5FA',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748B'
                    }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 44px',
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3B82F6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginTop: '6px',
                    backgroundColor: '#2563EB',
                    backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.75 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 22px rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Card Footer Register Link */}
              <div style={{
                marginTop: '32px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#94A3B8'
              }}>
                <span>Need an enterprise account? </span>
                <a
                  href="#register"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: '#60A5FA',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Register Organization
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
