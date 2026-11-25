'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Users, FolderKanban, Film, AlertTriangle, CheckCircle2, Cpu, Database, HardDrive, RefreshCw } from 'lucide-react';
import { api } from '@/utils/api';

export default function AdminPage() {
  const [stats, setStats] = useState({
    total_users: 1,
    active_users: 1,
    total_projects: 0,
    total_clips: 0,
    active_jobs: 0,
    failed_jobs: 0,
    system_status: 'Healthy'
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminStats().then(res => res && setStats(res)),
      api.getAdminUsers().then(res => res && res.users && setUsers(res.users))
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Admin & Multi-Tenant Control Center</h2>
            <span className="badge purple">Superadmin</span>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            System monitoring, user subscriptions, resource limits, and asynchronous video job queue health.
          </p>
        </div>

        <button onClick={fetchAdminData} className="btn btn-secondary btn-sm">
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh Metrics
        </button>
      </div>

      {/* Admin KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon cyan">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total_users}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FolderKanban size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total_projects}</div>
            <div className="stat-label">Projects Ingested</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Film size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total_clips}</div>
            <div className="stat-label">Total Highlights Rendered</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Cpu size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.active_jobs}</div>
            <div className="stat-label">Active Queue Tasks</div>
          </div>
        </div>
      </div>

      {/* Health & Infrastructure Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <HardDrive size={18} color="#00e5ff" />
            <span>Infrastructure & Engine Health</span>
          </div>
          <span className="badge green">● Operational</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#0a0e17', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Relational Database</div>
              <div style={{ fontWeight: 600, color: '#fff', marginTop: '2px' }}>SQLite / PostgreSQL Ready</div>
            </div>
            <div style={{ background: '#0a0e17', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Video Encoder</div>
              <div style={{ fontWeight: 600, color: '#22c55e', marginTop: '2px' }}>FFmpeg 7.1 Essentials Build</div>
            </div>
            <div style={{ background: '#0a0e17', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>YouTube Validation Engine</div>
              <div style={{ fontWeight: 600, color: '#00e5ff', marginTop: '2px' }}>yt-dlp v2025.06 Active</div>
            </div>
            <div style={{ background: '#0a0e17', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Failed Queue Jobs</div>
              <div style={{ fontWeight: 600, color: stats.failed_jobs > 0 ? '#ef4444' : '#94a3b8', marginTop: '2px' }}>
                {stats.failed_jobs} Failures
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} color="#9d4edd" />
            <span>Registered SaaS Accounts ({users.length})</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="queue-table">
            <thead>
              <tr>
                <th>User / Name</th>
                <th>Email Address</th>
                <th>Subscription Plan</th>
                <th>Processing Credits</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                  <td style={{ color: '#94a3b8' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.plan === 'CREATOR' ? 'purple' : u.plan === 'PRO' ? 'cyan' : 'gray'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#00e5ff' }}>{u.credits} mins</strong>
                  </td>
                  <td>
                    {u.is_admin ? (
                      <span className="badge amber">Admin</span>
                    ) : (
                      <span className="badge gray">User</span>
                    )}
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>{u.created_at || 'Today'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
