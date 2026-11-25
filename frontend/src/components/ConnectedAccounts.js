'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Save,
  Users,
  KeyRound,
  Lock,
  Layers,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';
import { api } from '@/utils/api';

export default function ConnectedAccounts() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [statusData, setStatusData] = useState({
    connected: false,
    configured: true,
    account: null
  });
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [prefs, setPrefs] = useState({
    default_title: '{{clip_title}} #Shorts',
    default_description: 'Extracted with TM Cliper AI #Shorts',
    default_tags: 'shorts, viral, tmcliper',
    default_privacy: 'public'
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Load status
  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getYouTubeStatus();
      if (res && res.status === 'success') {
        setStatusData({
          connected: Boolean(res.connected),
          configured: res.configured !== false,
          account: res.account
        });
        if (res.account) {
          setPrefs({
            default_title: res.account.default_title || '{{clip_title}} #Shorts',
            default_description: res.account.default_description || 'Extracted with TM Cliper AI #Shorts',
            default_tags: res.account.default_tags || 'shorts, viral, tmcliper',
            default_privacy: res.account.default_privacy || 'public'
          });
        }
      }
    } catch (err) {
      console.error('Failed to load YouTube connection status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();

    // Check for callback query params
    const statusParam = searchParams.get('status');
    const channelParam = searchParams.get('channel');
    const messageParam = searchParams.get('message');

    if (statusParam === 'connected') {
      setFeedbackMessage({
        type: 'success',
        text: `Successfully linked ${channelParam ? `channel "${channelParam}"` : 'your YouTube account'} via Google OAuth!`
      });
    } else if (statusParam === 'error') {
      setFeedbackMessage({
        type: 'error',
        text: `Authorization error: ${messageParam || 'Failed to authenticate with Google.'}`
      });
    }
  }, [searchParams]);

  // Connect handler
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.getYouTubeConnect();
      if (res.status === 'success' && res.auth_url) {
        // Redirect to Google's official OAuth consent screen
        window.location.href = res.auth_url;
      } else if (res.status === 'unconfigured') {
        setFeedbackMessage({
          type: 'warning',
          text: 'Google OAuth is pending setup: Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env'
        });
      } else {
        alert(res.message || 'Unable to generate Google authorization link.');
      }
    } catch (err) {
      alert('Error initiating connection: ' + err.message);
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect handler
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this YouTube account? Your generated clips will not be deleted.')) {
      return;
    }
    setLoading(true);
    try {
      await api.disconnectYouTubeAccount();
      setStatusData({ connected: false, configured: statusData.configured, account: null });
      setFeedbackMessage({
        type: 'success',
        text: 'YouTube account disconnected and credentials revoked.'
      });
    } catch (err) {
      alert('Disconnect failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save publishing preferences
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await api.updateYouTubePreferences(prefs);
      setFeedbackMessage({
        type: 'success',
        text: 'Default YouTube upload preferences saved successfully.'
      });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (err) {
      alert('Failed to save preferences: ' + err.message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const formatSubscribers = (count) => {
    if (!count) return '0 subscribers';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M subscribers`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K subscribers`;
    return `${count} subscribers`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600,
          background: feedbackMessage.type === 'success'
            ? 'rgba(34, 197, 94, 0.12)'
            : feedbackMessage.type === 'warning'
            ? 'rgba(234, 179, 8, 0.12)'
            : 'rgba(239, 68, 68, 0.12)',
          border: `1.5px solid ${
            feedbackMessage.type === 'success'
              ? 'rgba(34, 197, 94, 0.3)'
              : feedbackMessage.type === 'warning'
              ? 'rgba(234, 179, 8, 0.3)'
              : 'rgba(239, 68, 68, 0.3)'
          }`,
          color: feedbackMessage.type === 'success'
            ? '#22c55e'
            : feedbackMessage.type === 'warning'
            ? '#eab308'
            : '#ef4444'
        }}>
          {feedbackMessage.type === 'success' && <CheckCircle2 size={18} />}
          {feedbackMessage.type === 'warning' && <AlertTriangle size={18} />}
          {feedbackMessage.type === 'error' && <AlertTriangle size={18} />}
          <span style={{ flex: 1 }}>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main YouTube Card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <YouTubeLogo size={22} />
            <span style={{ fontSize: '16px', fontWeight: 700 }}>YouTube Account Connection</span>
          </div>
          <span className={statusData.connected ? 'badge green' : 'badge amber'}>
            {statusData.connected ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        <div className="card-body" style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '8px' }} />
              <div>Loading connection status...</div>
            </div>
          ) : statusData.connected && statusData.account ? (
            /* ================= CONNECTED STATE ================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                background: 'var(--pill-bg)',
                padding: '20px',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {statusData.account.channel_thumbnail ? (
                    <img
                      src={statusData.account.channel_thumbnail}
                      alt={statusData.account.channel_title}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF0000' }}
                    />
                  ) : (
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#FF0000',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '18px'
                    }}>
                      YT
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {statusData.account.channel_title || 'Connected Channel'}
                      </h3>
                      <span className="badge green" style={{ fontSize: '10px', padding: '2px 8px' }}>Active</span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {statusData.account.channel_handle && (
                        <span><strong>Handle:</strong> {statusData.account.channel_handle}</span>
                      )}
                      <span><strong>Channel ID:</strong> {statusData.account.channel_id}</span>
                      <span><strong>Audience:</strong> {formatSubscribers(statusData.account.subscriber_count)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {statusData.account.channel_id && (
                    <a
                      href={`https://www.youtube.com/channel/${statusData.account.channel_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={13} /> View Channel
                    </a>
                  )}
                  <button
                    onClick={handleDisconnect}
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trash2 size={13} /> Disconnect
                  </button>
                </div>
              </div>

              {/* Authorized Permissions Information */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#22c55e" />
                  <span>Authorized Permissions & Security</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color="#22c55e" />
                    <span>Upload generated 9:16 vertical Shorts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color="#22c55e" />
                    <span>Read channel profile & subscriber count</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={14} color="#2563eb" />
                    <span>Credentials encrypted at rest with Fernet</span>
                  </div>
                </div>
              </div>

              {/* Default Publishing Preferences Form */}
              <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Default Upload Preferences
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Title Template</label>
                    <input
                      type="text"
                      value={prefs.default_title}
                      onChange={(e) => setPrefs({ ...prefs, default_title: e.target.value })}
                      placeholder="{{clip_title}} #Shorts"
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Use {"{{clip_title}}"} as the dynamic placeholder</span>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Default Privacy</label>
                    <select
                      value={prefs.default_privacy}
                      onChange={(e) => setPrefs({ ...prefs, default_privacy: e.target.value })}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', fontSize: '13px' }}
                    >
                      <option value="public">Public (Instant reach)</option>
                      <option value="unlisted">Unlisted (Share via link first)</option>
                      <option value="private">Private (Review before publishing)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Default Tags</label>
                  <input
                    type="text"
                    value={prefs.default_tags}
                    onChange={(e) => setPrefs({ ...prefs, default_tags: e.target.value })}
                    placeholder="shorts, viral, podcast, tmcliper"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', fontSize: '13px' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Default Video Description</label>
                  <textarea
                    rows={2}
                    value={prefs.default_description}
                    onChange={(e) => setPrefs({ ...prefs, default_description: e.target.value })}
                    placeholder="Auto-generated using TM Cliper AI #Shorts"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={savingPrefs}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', padding: '8px 20px', fontWeight: 700 }}
                  >
                    <Save size={14} /> {savingPrefs ? 'Saving...' : 'Save Upload Preferences'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= DISCONNECTED STATE ================= */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px 16px',
              maxWidth: '560px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <YouTubeLogo size={36} />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                Connect YouTube Account
              </h3>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                Connect your personal YouTube channel to upload your rendered 9:16 vertical clips directly to YouTube Shorts with 1 click.
              </p>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="btn btn-primary"
                style={{
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FF0000',
                  borderColor: '#FF0000',
                  boxShadow: '0 4px 14px rgba(255, 0, 0, 0.3)'
                }}
              >
                <YouTubeLogo size={18} />
                <span>{connecting ? 'Redirecting to Google...' : 'Connect YouTube Account'}</span>
              </button>

              <div style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <Lock size={13} color="#22c55e" />
                <span>Google handles authorization securely via official OAuth 2.0. TM Cliper never sees or stores your password.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
