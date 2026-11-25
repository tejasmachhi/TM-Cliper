'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sparkles, Menu, X } from 'lucide-react';

const PUBLIC_ROUTES = ['/', '/features', '/pricing', '/login', '/register', '/forgot-password'];

function AppShellInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Close sidebar and mobile nav on route change
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Protected route check: if trying to access private dashboard and unauthenticated, redirect to /login
    if (!loading && !isAuthenticated && !isPublicRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    // If authenticated user visits login or register, redirect to /dashboard
    if (!loading && isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, isPublicRoute]);

  // Loading skeleton while initial auth is resolved
  if (loading && !isPublicRoute) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '18px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)' }}>
            TM
          </div>
          <div style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Loading TM Cliper...</div>
        </div>
      </div>
    );
  }

  // If on login/register/forgot-password, render clean focused auth container
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
      </div>
    );
  }

  // If on public marketing pages (/features, /pricing) or landing page without dashboard
  if (isPublicRoute) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
        {/* Top Announcement Bar */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
          padding: '8px 16px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          letterSpacing: '0.2px'
        }}>
          <span>🚀 TM Cliper 4.0 is live: 100% Free Beta with Unlimited AI Clip Generation!</span>
          <Link href="/features" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 700 }}>
            Explore Features →
          </Link>
        </div>

        {/* Public SaaS Navigation Header */}
        <header style={{ 
          height: '70px', 
          borderBottom: '1.5px solid var(--border-color)', 
          background: 'var(--header-bg)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'var(--text-primary)', 
              color: 'var(--bg-primary)', 
              fontWeight: 900, 
              fontSize: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              TM
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>
                TM Cliper
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{ fontSize: '14px', fontWeight: pathname === '/' ? 700 : 500, color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Home
            </Link>
            <Link href="/features" style={{ fontSize: '14px', fontWeight: pathname === '/features' ? 700 : 500, color: pathname === '/features' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Features
            </Link>
            <Link href="/pricing" style={{ fontSize: '14px', fontWeight: pathname === '/pricing' ? 700 : 500, color: pathname === '/pricing' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Free Access
            </Link>
            <Link href="/docs" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              User Guide
            </Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontWeight: 700, borderRadius: '9999px' }}>
                Open Dashboard ➔
              </Link>
            ) : (
              <>
                <Link href="/login" className="desktop-only" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', padding: '8px 12px' }}>
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontWeight: 700, borderRadius: '9999px' }}>
                  Get Started Free
                </Link>
              </>
            )}

            {/* Mobile Nav Hamburger */}
            <button 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} 
              className="mobile-menu-btn"
              style={{ display: 'none', padding: '8px', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)', borderRadius: '8px', background: 'var(--pill-bg)', cursor: 'pointer' }}
              aria-label="Toggle Navigation"
            >
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {isMobileNavOpen && (
          <div style={{
            background: 'var(--bg-card)',
            borderBottom: '1.5px solid var(--border-color)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'sticky',
            top: '70px',
            zIndex: 99,
            boxShadow: 'var(--card-shadow)'
          }}>
            <Link href="/" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}>Home</Link>
            <Link href="/features" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}>Features</Link>
            <Link href="/pricing" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}>Free Access ($0)</Link>
            <Link href="/docs" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}>User Guide & Docs</Link>
            <hr style={{ border: 'none', borderTop: '1.5px solid var(--border-color)', margin: '4px 0' }} />
            {!isAuthenticated ? (
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <Link href="/login" onClick={() => setIsMobileNavOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Sign in</Link>
                <Link href="/register" onClick={() => setIsMobileNavOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Sign up Free</Link>
              </div>
            ) : (
              <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>Dashboard ➔</Link>
            )}
          </div>
        )}

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    );
  }

  // Protected SaaS App Dashboard Layout
  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <AuthProvider>
      <AppShellInner>
        {children}
      </AppShellInner>
    </AuthProvider>
  );
}
