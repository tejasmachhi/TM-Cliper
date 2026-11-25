'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Shield, Sparkles, Clock, AlertCircle, FileText, Download } from 'lucide-react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [userStatus, setUserStatus] = useState({
    credits_remaining: 60,
    subscription_plan: 'FREE'
  });
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    api.getPlans().then(res => {
      if (res && res.plans) setPlans(res.plans);
    }).catch(() => { });

    api.getInvoices().then(res => {
      if (res && res.invoices) setInvoices(res.invoices);
    }).catch(() => { });

    api.getSystemStatus().then(res => {
      if (res && res.stats) {
        setUserStatus({
          credits_remaining: res.stats.credits_remaining ?? 60,
          subscription_plan: res.stats.subscription_plan ?? 'FREE'
        });
      }
    }).catch(() => { });
  }, []);

  const handlePlanChange = (planId) => {
    setUserStatus(prev => ({
      ...prev,
      subscription_plan: planId,
      credits_remaining: planId === 'CREATOR' ? 1000 : (planId === 'PRO' ? 300 : 60)
    }));
    setActionMessage(`Subscription updated to ${planId}. Your account credits have been refreshed.`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleCancelSubscription = () => {
    if (!confirm('Are you sure you want to cancel your recurring subscription? You will retain access until the end of this billing period.')) return;
    setUserStatus(prev => ({ ...prev, subscription_plan: 'FREE' }));
    setActionMessage('Your subscription has been cancelled. Account reverted to Free Tier.');
    setTimeout(() => setActionMessage(''), 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Billing & Subscription Management</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your subscription tier, view remaining processing credits, and download past invoices.
        </p>
      </div>

      {actionMessage && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#22c55e', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' }}>
          ✓ {actionMessage}
        </div>
      )}

      {/* Current Quota Card */}
      <div className="card" style={{ background: '#ffffff', border: '2px solid #22c55e', borderRadius: '16px', boxShadow: '0 4px 16px rgba(34, 197, 94, 0.08)' }}>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ✓ 100% Free Beta Active
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              UNLIMITED CREATOR TIER ($0/mo)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              All features are 100% unlocked for all creators during beta: unlimited videos, 9:16 smart vertical crop, and 1-click downloads.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', padding: '14px 20px', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#16a34a', textTransform: 'uppercase', fontWeight: 700 }}>Processing Status</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d' }}>
                Unlimited <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {plans.map((p) => {
          const isCurrent = userStatus.subscription_plan === p.id;
          return (
            <div
              key={p.id}
              className="card"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9', padding: '18px 20px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>$0 <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>/ Free Beta</span></div>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
                <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700 }}>
                  ⚡ Unlimited Video Processing
                </div>
                <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 700 }}>
                  🎬 6+ High-Retention Viral Clips
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.features.map((feat, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color="#16a34a" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanChange(p.id)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px', fontWeight: 700, borderRadius: '9999px' }}
                >
                  ✓ Free Unlocked Tier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment History & Invoices */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} color="#00e5ff" />
            <span>Payment History & Receipts</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="queue-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Billing Date</th>
                <th>Plan Tier</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td><span className="badge purple">{inv.plan}</span></td>
                  <td><strong>{inv.amount}</strong></td>
                  <td><span className="badge green">{inv.status}</span></td>
                  <td>
                    <button
                      onClick={() => alert(`Downloading receipt ${inv.id}...`)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={12} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
