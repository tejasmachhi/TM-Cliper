'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Settings,
  Share2,
  ShieldCheck,
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';
import { api } from '@/utils/api';

export default function YouTubeIntegrationPage() {
  const [integration, setIntegration] = useState({
    connected: false,
    channel_title: '',
    subscriber_count: 0,
    channel_id: '',
    default_privacy: 'public',
    default_title: '{{clip_title}} #Shorts',
    default_tags: 'shorts, viral, ai',
    default_description: 'Auto-generated with ClipGenius AI.'
  });
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    api.getYouTubeIntegration()
      .then(res => {
        if (res && res.integration) setIntegration(res.integration);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.connectYouTube();
      if (res && res.integration) setIntegration(res.integration);
      setSavedMessage('Connected YouTube channel via Google OAuth.');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (e) {
      alert('Connection failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this YouTube channel?')) return;
    try {
      await api.disconnectYouTube();
      setIntegration(prev => ({ ...prev, connected: false }));
      setSavedMessage('YouTube channel disconnected.');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (e) {
      alert('Disconnect failed: ' + e.message);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      await api.updateYouTubePreferences({
        default_title: integration.default_title,
        default_description: integration.default_description,
        default_tags: integration.default_tags,
        default_privacy: integration.default_privacy,
      });
      setSavedMessage('Default publishing preferences saved successfully.');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (e) {
      alert('Save failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <YouTubeLogo size={22} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>YouTube Channel Integration</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Connect your authorized YouTube channel to enable 1-click publishing of your vertical Shorts directly to your channel.
        </p>
      </div>

      {savedMessage && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#22c55e', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} color="#00e5ff" />
            <span>Google OAuth Connection Status</span>
          </div>
          <span className={integration.connected ? 'badge green' : 'badge amber'}>
            {integration.connected ? 'Active Connection' : 'Not Connected'}
          </span>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {integration.connected ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FF0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
                  YT
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {integration.channel_title || 'Your Official Channel'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Channel ID: {integration.channel_id || 'UCxxxxxxxxxxxx'} • {(integration.subscriber_count || 28400).toLocaleString()} subscribers
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDisconnect} className="btn btn-danger btn-sm">
                  Disconnect Channel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <YouTubeLogo size={28} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No YouTube Channel Connected
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '2' }}>
                Authenticate with Google OAuth to automatically upload 9:16 vertical clips as YouTube Shorts. We never store your Google password.
              </p>
              <button onClick={handleConnect} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700, borderRadius: '9999px' }}>
                <YouTubeLogo size={16} /> Connect with Google Account
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
            <AlertCircle size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Security Guarantee:</strong> TM Cliper uses official Google OAuth2.0 with restricted YouTube upload scopes. Videos are only uploaded upon your explicit confirmation.
            </span>
          </div>
        </div>
      </div>

      {/* Upload Preferences Form */}
      {integration.connected && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Settings size={18} color="#9d4edd" />
              <span>Default Publishing Preferences</span>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label>Default Short Title Format</label>
              <input
                type="text"
                value={integration.default_title}
                onChange={(e) => setIntegration({ ...integration, default_title: e.target.value })}
                placeholder="{{clip_title}} #Shorts"
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Tip: Use <code>&#123;&#123;clip_title&#125;&#125;</code> to auto-inject the AI engagement moment headline.
              </span>
            </div>

            <div>
              <label>Default Privacy Setting</label>
              <select
                value={integration.default_privacy}
                onChange={(e) => setIntegration({ ...integration, default_privacy: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="public">Public (Instant Release to Subscribers)</option>
                <option value="unlisted">Unlisted (Accessible only via direct URL)</option>
                <option value="private">Private (Only viewable by you)</option>
              </select>
            </div>

            <div>
              <label>Default YouTube Tags</label>
              <input
                type="text"
                value={integration.default_tags}
                onChange={(e) => setIntegration({ ...integration, default_tags: e.target.value })}
                placeholder="shorts, viral, podcast, highlight"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label>Default Description Template</label>
              <textarea
                rows={3}
                value={integration.default_description}
                onChange={(e) => setIntegration({ ...integration, default_description: e.target.value })}
                placeholder="Generated automatically with ClipGenius AI."
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
                <Save size={15} /> Save Default Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
