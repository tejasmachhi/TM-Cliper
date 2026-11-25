'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, Film, Plus, Share2, CheckCircle2 } from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';

export default function ScheduledUploadsPage() {
  const [scheduledClips, setScheduledClips] = useState([
    {
      id: 'sch-1',
      title: 'INSANE HIGH-SPEED CHASE #Shorts',
      scheduled_for: 'Tomorrow at 06:00 PM',
      platform: 'YouTube Shorts',
      status: 'Queued',
      privacy: 'Public'
    },
    {
      id: 'sch-2',
      title: 'GOD-TIER CLUTCH & DEFUSE #Shorts',
      scheduled_for: 'Friday at 12:30 PM',
      platform: 'YouTube Shorts',
      status: 'Queued',
      privacy: 'Public'
    }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <CalendarIcon size={20} color="#00e5ff" />
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Scheduled Shorts Uploads</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Automate your YouTube Shorts schedule to publish during peak audience engagement windows.
          </p>
        </div>

        <Link href="/clip-library" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontWeight: 700 }}>
          <Plus size={15} /> Schedule a Clip from Library
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={18} color="#9d4edd" />
            <span>Upcoming Upload Queue</span>
          </div>
          <span className="badge cyan">{scheduledClips.length} Scheduled</span>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {scheduledClips.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ color: '#fff', fontWeight: 600, marginBottom: '6px' }}>No uploads currently scheduled</p>
              <p style={{ fontSize: '13px' }}>Select any clip from your Clip Library and schedule it for publishing.</p>
            </div>
          ) : (
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Clip Title</th>
                  <th>Target Platform</th>
                  <th>Scheduled Time</th>
                  <th>Privacy</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduledClips.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{item.title}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <YouTubeLogo size={14} /> {item.platform}
                      </span>
                    </td>
                    <td><span style={{ color: '#00e5ff', fontSize: '12px' }}>{item.scheduled_for}</span></td>
                    <td><span className="badge cyan">{item.privacy}</span></td>
                    <td><span className="badge green">{item.status}</span></td>
                    <td>
                      <button 
                        onClick={() => setScheduledClips(prev => prev.filter(c => c.id !== item.id))}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
