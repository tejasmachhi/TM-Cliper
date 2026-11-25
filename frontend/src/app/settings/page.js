'use client';

import { useState } from 'react';
import { Settings, Sliders, Folder, Cpu, Shield, Save, CheckCircle2, User, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '@/styles/settings.scss';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || 'ClipGenius Creator');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    <div className="settings-container" style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Account & Engine Settings</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Manage your personal profile, credentials, and AI scoring parameters.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ padding: '8px 18px', fontWeight: 700 }}>
          <Save size={14} /> Save Configuration
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: '12px 16px', borderRadius: '8px', color: '#00e676', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> Changes saved successfully!
        </div>
      )}

      {/* Profile Section */}
      <div className="settings-section">
        <div className="section-title">
          <User size={18} color="#00e5ff" />
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
              value={user?.email || 'creator@clipgenius.ai'} 
              disabled 
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      {/* AI Scoring Weights */}
      <div className="settings-section">
        <div className="section-title">
          <Sliders size={18} color="#00e5ff" />
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

          <div className="form-group">
            <label>Context & Sentence Completeness ({settings.weight_context}%)</label>
            <input 
              type="range" min="5" max="30" 
              value={settings.weight_context} 
              onChange={(e) => setSettings({ ...settings, weight_context: Number(e.target.value) })} 
            />
          </div>

          <div className="form-group">
            <label>Audience Feedback & Reactions ({settings.weight_audience}%)</label>
            <input 
              type="range" min="0" max="25" 
              value={settings.weight_audience} 
              onChange={(e) => setSettings({ ...settings, weight_audience: Number(e.target.value) })} 
            />
          </div>
        </div>
      </div>

      {/* Directory & Defaults */}
      <div className="settings-section">
        <div className="section-title">
          <Folder size={18} color="#9d4edd" />
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
  );
}
