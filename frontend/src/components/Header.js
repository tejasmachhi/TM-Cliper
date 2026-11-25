'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Moon, BookOpen, User, LogOut, Menu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ onMenuToggle }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('clipgenius_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('clipgenius_theme', nextTheme);
  };

  const displayName = user 
    ? (user.name ? user.name.replace('ClipGenius', 'TM Cliper') : user.email)
    : 'Creator';

  return (
    <header className="top-header" style={{
      height: '64px',
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Hamburger Menu Toggle */}
        <button 
          onClick={onMenuToggle}
          className="mobile-menu-btn"
          style={{ 
            display: 'none', 
            padding: '8px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)', 
            background: 'var(--pill-bg)',
            color: 'var(--text-primary)',
            cursor: 'pointer' 
          }}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <h1 className="page-title" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
          TM Cliper Studio
        </h1>

        <span className="badge green desktop-only" style={{ display: 'inline-flex', fontSize: '10px', padding: '2px 8px', borderRadius: '6px' }}>
          100% Free Beta
        </span>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* User Guide Link */}
        <Link 
          href="/docs" 
          className="system-pill desktop-only"
          style={{ 
            cursor: 'pointer', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--pill-bg)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textDecoration: 'none'
          }}
          title="Open User Guide & Documentation"
        >
          <BookOpen size={14} color="#2563eb" />
          <span>Docs</span>
        </Link>

        {/* Engine Status */}
        <div className="system-pill desktop-only" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--pill-bg)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <Sparkles size={13} color="#2563eb" />
          <span>Engine: <strong style={{ color: 'var(--text-primary)' }}>Universal AI</strong></span>
        </div>

        {/* User Profile Pill */}
        {isAuthenticated && user ? (
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '5px 10px', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--pill-bg)'
          }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '10px' }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </span>
            <button 
              onClick={() => logout(true)}
              style={{ display: 'flex', alignItems: 'center', color: '#ef4444', marginLeft: '2px', cursor: 'pointer', padding: '2px' }}
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm" style={{ padding: '6px 14px' }}>
            Sign In
          </Link>
        )}

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          style={{ 
            cursor: 'pointer', 
            padding: '7px 10px',
            background: 'var(--pill-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={15} color="#fbbf24" />
          ) : (
            <Moon size={15} color="#475569" />
          )}
        </button>
      </div>
    </header>
  );
}
