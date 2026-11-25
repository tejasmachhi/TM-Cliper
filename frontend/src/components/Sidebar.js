'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Film,
  Settings,
  BookOpen,
  LogOut,
  Share2,
  X,
  CheckCircle2
} from 'lucide-react';
import YouTubeLogo from './YouTubeLogo';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navSections = [
    {
      label: 'MAIN WORKFLOW',
      items: [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Create Clips', href: '/create', icon: Sparkles, highlight: true },
        { name: 'My Projects', href: '/projects', icon: FolderKanban },
        { name: 'Video History', href: '/clip-library', icon: Film },
      ]
    },
    {
      label: 'PUBLISHING & CHANNELS',
      items: [
        { name: 'YouTube Publishing', href: '/integrations/youtube', icon: Share2, hasYtBadge: true },
      ]
    },
    {
      label: 'SYSTEM & HELP',
      items: [
        { name: 'Account Settings', href: '/settings', icon: Settings },
        { name: 'User Guide & Docs', href: '/docs', icon: BookOpen },
      ]
    }
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          minWidth: '260px',
          maxWidth: '260px',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--sidebar-bg)',
          borderRight: '1.5px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div className="sidebar-header" style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: 900, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              TM
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
                TM Cliper
              </div>
              <div className="brand-sub" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                AI Video Clipping Platform
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="mobile-close-btn"
            style={{ display: 'none', padding: '6px', color: 'var(--text-secondary)' }}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu" style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              <div className="nav-label" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-muted)', padding: '4px 12px 6px', textTransform: 'uppercase' }}>
                {section.label}
              </div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      color: isActive ? 'var(--nav-active-text)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                      border: isActive ? '1px solid var(--nav-active-border)' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.hasYtBadge ? (
                      <YouTubeLogo size={14} />
                    ) : (
                      <Icon size={16} color={isActive ? 'var(--nav-active-text)' : (item.highlight ? '#2563eb' : 'var(--text-muted)')} />
                    )}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Logout Action */}
          <button 
            onClick={() => {
              if (onClose) onClose();
              logout(true);
            }}
            className="nav-item"
            style={{ 
              width: '100%', 
              color: '#ef4444', 
              marginTop: 'auto', 
              cursor: 'pointer', 
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'transparent',
              border: 'none'
            }}
          >
            <LogOut size={16} color="#ef4444" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Sidebar Footer with 100% Free Beta Status */}
        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1.5px solid var(--border-color)', background: 'var(--sidebar-footer-bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                AI Video Engine
              </span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>ONLINE</span>
            </div>
            <div style={{ 
              background: 'var(--pill-bg)', 
              border: '1.5px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '6px 10px', 
              fontSize: '11px', 
              color: 'var(--text-primary)', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>100% Free Beta — Unlimited</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
