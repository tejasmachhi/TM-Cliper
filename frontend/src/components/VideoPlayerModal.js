'use client';

import { useState } from 'react';
import { X, Play, Download, Trash2, Film, Sparkles, Upload } from 'lucide-react';
import YouTubeLogo from '@/components/YouTubeLogo';
import UploadToYouTubeModal from '@/components/UploadToYouTubeModal';

export default function VideoPlayerModal({ clip, onClose, onDelete }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  if (!clip) return null;

  const rawUrl = clip.video_url || `/api/clips/${clip.id}/stream`;
  const streamUrl = rawUrl.startsWith('http') ? rawUrl : `http://127.0.0.1:8000${rawUrl}`;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Film size={20} color="#00e5ff" />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                {clip.title || 'Clip Preview'}
              </h3>
              <span className="badge cyan">Score: {clip.score || clip.engagement_score || 90}/100</span>
              <span className="badge purple">{clip.aspect_ratio || clip.output_format || '9:16 Shorts'}</span>
            </div>
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', minHeight: '320px' }}>
              <video 
                src={streamUrl} 
                controls 
                autoPlay 
                playsInline
                style={{ maxHeight: '520px', maxWidth: '100%', borderRadius: '8px' }}
              >
                Your browser does not support HTML5 video preview.
              </video>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: '#111827', padding: '12px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Category</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{clip.category || 'Highlights'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Duration</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{clip.duration ? `${clip.duration}s` : '30s'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Engagement Score</div>
                <div style={{ fontWeight: 600, color: '#00e5ff' }}>{clip.score || clip.engagement_score || 92}/100</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Export Format</div>
                <div style={{ fontWeight: 600, color: '#22c55e' }}>{clip.aspect_ratio || '9:16 Vertical HD'}</div>
              </div>
            </div>

            {clip.selection_reason && (
              <div style={{ background: '#0a0e17', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#00e5ff', fontWeight: 600 }}>AI Selection Rationale: </span>
                {clip.selection_reason}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this clip?')) {
                    onDelete && onDelete(clip.id);
                    onClose();
                  }
                }}
              >
                <Trash2 size={15} /> Delete Clip
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,0,0,0.1)', color: '#FF0000', borderColor: 'rgba(255,0,0,0.3)', fontWeight: 600 }}
                >
                  <YouTubeLogo size={14} />
                  <span>Upload to YouTube</span>
                </button>

                <a 
                  href={streamUrl} 
                  download={`${clip.title || 'clip'}.mp4`} 
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} /> Download MP4
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadToYouTubeModal
          clip={clip}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </>
  );
}
