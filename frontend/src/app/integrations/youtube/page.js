'use client';

import ConnectedAccounts from '@/components/ConnectedAccounts';
import YouTubeLogo from '@/components/YouTubeLogo';

export default function YouTubeIntegrationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <YouTubeLogo size={22} />
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            YouTube Channel Integration
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Connect your authorized YouTube channel to enable 1-click publishing of your vertical Shorts directly to your channel.
        </p>
      </div>

      <ConnectedAccounts />
    </div>
  );
}
