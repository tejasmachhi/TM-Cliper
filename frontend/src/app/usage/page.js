'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Clock, Zap, HardDrive, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';

export default function UsagePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recordings_count: 0,
    clips_count: 0,
    storage_used_gb: 0.2,
    credits_remaining: 60,
    subscription_plan: 'FREE'
  });

  useEffect(() => {
    api.getSystemStatus().then(res => {
      if (res && res.stats) setStats(res.stats);
    }).catch(() => {});
  }, []);

  const totalMonthlyAllocation = stats.subscription_plan === 'CREATOR' ? 1000 : (stats.subscription_plan === 'PRO' ? 300 : 60);
  const usedMinutes = Math.max(0, totalMonthlyAllocation - stats.credits_remaining);
  const usagePercentage = Math.min(100, Math.round((usedMinutes / totalMonthlyAllocation) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Usage & Processing Credits</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Track your monthly video minutes consumption and remaining credits.
        </p>
      </div>

      {/* Monthly Quota Meter Card */}
      <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Monthly Processing Access</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>100% Free Beta — Unlimited video processing and clip exports unlocked.</p>
          </div>
          <span className="badge green" style={{ padding: '6px 14px', fontWeight: 700 }}>
            Unlimited Free Beta
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #16a34a)', borderRadius: '5px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
          <span>Processed: <strong style={{ color: '#0f172a' }}>{stats.recordings_count} videos</strong></span>
          <span>Status: <strong style={{ color: '#16a34a' }}>Active & Unlimited</strong></span>
        </div>
      </div>

      {/* Usage Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Videos Processed</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>{stats.recordings_count}</div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>Across all projects</div>
        </div>

        <div className="card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Clips Rendered</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', marginTop: '6px' }}>{stats.clips_count}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>9:16 Shorts & 16:9</div>
        </div>

        <div className="card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Storage Used</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', marginTop: '6px' }}>{stats.storage_used_gb} GB</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Auto-cleaned after 3 days</div>
        </div>
      </div>
    </div>
  );
}
