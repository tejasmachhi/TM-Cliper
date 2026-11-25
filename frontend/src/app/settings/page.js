'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, Sliders, Folder, Cpu, Shield, Save, CheckCircle2, User, Lock, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ConnectedAccounts from '@/components/ConnectedAccounts';
import YouTubeLogo from '@/components/YouTubeLogo';
import '@/styles/settings.scss';

export default function SettingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' or 'general'

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'general') setActiveTab('general');
    else if (tab === 'accounts') setActiveTab('accounts');
  }, [searchParams]);

  const [profileName, setProfileName] = useState(user?.name || 'TM Cliper Creator');
  const [settings, setSettings] = useState({
    projects_dir: 'storage/projects',
    default_clips: 6,
    default_aspect_ratio: '9:16',
    weight_content: 25,
    weight_transcript: 20,
    weight_visual: 15,
    weight_audio: 15,
    weight_context: 15,
    weight_audience: 10,
    gpu_acceleration: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Studio Settings & Connected Accounts
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your personal profile, YouTube channel integration, and AI clipping parameters.
          </p>
        </div>

        {activeTab === 'general' && (
          <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ padding: '8px 18px', fontWeight: 700, borderRadius: '9999px' }}>
            <Save size={14} /> Save Configuration
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('accounts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'accounts' ? '2.5px solid #FF0000' : '2.5px solid transparent',
            background: activeTab === 'accounts' ? 'var(--pill-bg)' : 'transparent',
            color: activeTab === 'accounts' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'accounts' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <YouTubeLogo size={16} />
          <span>Connected Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'general' ? '2.5px solid #2563eb' : '2.5px solid transparent',
            background: activeTab === 'general' ? 'var(--pill-bg)' : 'transparent',
            color: activeTab === 'general' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'general' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <Sliders size={16} />
          <span>Profile & AI Parameters</span>
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', padding: '10px 16px', borderRadius: '8px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> Configuration saved successfully!
        </div>
      )}

      {/* Tab 1: Connected Accounts */}
      {activeTab === 'accounts' && (
        <ConnectedAccounts />
      )}

      {/* Tab 2: General & AI Parameters */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile Section */}
          <div className="settings-section">
            <div className="section-title">
              <User size={18} color="#2563eb" />
              <span>Profile & Account Credentials</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || 'creator@tmcliper.ai'} 
                  disabled 
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>

          {/* AI Scoring Weights */}
          <div className="settings-section">
            <div className="section-title">
              <Sliders size={18} color="#2563eb" />
              <span>Explainable Engagement Weights (Total = 100%)</span>
            </div>
            <div className="section-desc">Tune the multi-factor scoring parameters used to rank clip candidates.</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label>Content Interest ({settings.weight_content}%)</label>
                <input 
                  type="range" min="10" max="40" 
                  value={settings.weight_content} 
                  onChange={(e) => setSettings({ ...settings, weight_content: Number(e.target.value) })} 
                />
              </div>

              <div className="form-group">
                <label>Transcript & Speech Importance ({settings.weight_transcript}%)</label>
                <input 
                  type="range" min="10" max="40" 
                  value={settings.weight_transcript} 
                  onChange={(e) => setSettings({ ...settings, weight_transcript: Number(e.target.value) })} 
                />
              </div>

              <div className="form-group">
                <label>Visual Scene Activity ({settings.weight_visual}%)</label>
                <input 
                  type="range" min="5" max="30" 
                  value={settings.weight_visual} 
                  onChange={(e) => setSettings({ ...settings, weight_visual: Number(e.target.value) })} 
                />
              </div>

              <div className="form-group">
                <label>Audio & Emotional Intensity ({settings.weight_audio}%)</label>
                <input 
                  type="range" min="5" max="30" 
                  value={settings.weight_audio} 
                  onChange={(e) => setSettings({ ...settings, weight_audio: Number(e.target.value) })} 
                />
              </div>
            </div>
          </div>

          {/* Storage Defaults */}
          <div className="settings-section">
            <div className="section-title">
              <Folder size={18} color="#a855f7" />
              <span>Storage & Export Defaults</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Projects Storage Root</label>
                <input 
                  type="text" 
                  value={settings.projects_dir} 
                  onChange={(e) => setSettings({ ...settings, projects_dir: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label>Default Clips Count</label>
                <select 
                  value={settings.default_clips}
                  onChange={(e) => setSettings({ ...settings, default_clips: Number(e.target.value) })}
                >
                  <option value="6">6 Clips (Standard)</option>
                  <option value="8">8 Clips</option>
                  <option value="10">10 Clips</option>
                  <option value="15">15 Clips</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
