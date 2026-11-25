'use client';

import { useState, useEffect } from 'react';
import { Film, Play, Download, Trash2, Filter, Sparkles, CheckSquare, Square, Clock } from 'lucide-react';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import Link from 'next/link';
import { api } from '@/utils/api';
import '@/styles/clips.scss';

export default function ClipLibraryPage() {
  const [clips, setClips] = useState([]);
  const [activeClip, setActiveClip] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClips = () => {
    api.getClips().then(res => {
      if (res && res.clips) setClips(res.clips);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchClips();
  }, []);

  const filteredClips = clips.filter(c => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (c.score < filterMinScore && (c.engagement_score || 0) < filterMinScore) return false;
    return true;
  });

  const allFilteredSelected = filteredClips.length > 0 && filteredClips.every(c => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClips.map(c => c.id));
    }
  };

  const toggleSelectOne = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} clip(s)? This will free up local storage space.`)) return;
    
    setIsDeleting(true);
    try {
      await api.batchDeleteClips(selectedIds);
      setClips(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    } catch (err) {
      alert('Batch delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCleanupOld = async () => {
    if (!confirm('Auto-Clean: Delete clips and storage older than 3 days?')) return;
    setIsDeleting(true);
    try {
      const res = await api.cleanupOldClips(3);
      alert(`Cleaned up ${res.deleted_count || 0} clip(s) older than 3 days.`);
      fetchClips();
      setSelectedIds([]);
    } catch (err) {
      alert('Auto-clean failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>AI Clip Library</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Extracted highlights rendered in 9:16 vertical Shorts and 16:9 formats with visual image previews.
          </p>
        </div>

        <Link href="/create" className="btn btn-primary btn-sm">
          <Sparkles size={14} /> + Create New Clips
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="clips-filter-bar">
        <div className="filter-group">
          <Filter size={15} color="var(--text-muted)" />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Gaming">Gaming</option>
            <option value="Podcast">Podcast</option>
            <option value="Interview">Interview</option>
            <option value="Educational">Educational</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Entertainment">Entertainment</option>
            <option value="General">General</option>
          </select>

          <select 
            value={filterMinScore} 
            onChange={(e) => setFilterMinScore(Number(e.target.value))}
          >
            <option value="0">All AI Scores</option>
            <option value="85">Score ≥ 85% (High Engagement)</option>
            <option value="92">Score ≥ 92% (Top Viral Picks)</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredClips.length}</strong> of {clips.length} clips
        </div>
      </div>

      {/* Batch Actions & Auto-Clean Bar */}
      {filteredClips.length > 0 && (
        <div className="batch-actions-bar">
          <div className="batch-info">
            <label className="select-all-label" onClick={toggleSelectAll}>
              <input 
                type="checkbox" 
                checked={allFilteredSelected} 
                onChange={() => {}} 
              />
              <span>Select All ({filteredClips.length})</span>
            </label>

            {selectedIds.length > 0 && (
              <span className="selected-count-tag">
                {selectedIds.length} Selected
              </span>
            )}
          </div>

          <div className="batch-buttons">
            {selectedIds.length > 0 && (
              <button 
                className="btn btn-danger btn-sm" 
                onClick={handleBatchDelete}
                disabled={isDeleting}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleCleanupOld}
              disabled={isDeleting}
              title="Automatically remove clips older than 3 days to save disk space"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={14} />
              <span>Auto-Clean (&gt;3 Days)</span>
            </button>
          </div>
        </div>
      )}

      {/* Clips Grid */}
      {filteredClips.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px' }}>No clips found</p>
          <p style={{ fontSize: '13px', marginBottom: '16px' }}>Generate clips from any authorized YouTube video link or upload a file.</p>
          <Link href="/create" className="btn btn-primary btn-sm">
            <Sparkles size={14} /> Create Clips Now
          </Link>
        </div>
      ) : (
        <div className="clips-grid">
          {filteredClips.map(clip => {
            const rawUrl = clip.video_url || `/api/clips/${clip.id}/stream`;
            const streamUrl = rawUrl.startsWith('http') ? rawUrl : `http://127.0.0.1:8000${rawUrl}`;
            
            const rawThumb = clip.thumbnail_url || `/api/clips/${clip.id}/thumbnail`;
            const thumbUrl = rawThumb.startsWith('http') ? rawThumb : `http://127.0.0.1:8000${rawThumb}`;

            const isSelected = selectedIds.includes(clip.id);

            return (
              <div 
                key={clip.id} 
                className="clip-card"
                style={isSelected ? { borderColor: 'var(--accent-cyan)', boxShadow: '0 0 15px rgba(0, 229, 255, 0.25)' } : {}}
              >
                <div 
                  className="clip-thumbnail-wrapper"
                  onClick={() => setActiveClip(clip)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Select Checkbox Overlay */}
                  <div 
                    className="clip-select-overlay" 
                    onClick={(e) => toggleSelectOne(clip.id, e)}
                  >
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => {}}
                    />
                  </div>

                  {/* Real Image Preview */}
                  <img 
                    src={thumbUrl} 
                    alt={clip.title}
                    className="clip-thumb"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="thumb-placeholder" style={{ display: 'none' }}>
                    <Film size={32} />
                    <span style={{ fontSize: '11px', marginTop: '4px' }}>Click to preview</span>
                  </div>

                  <div className="clip-score-badge">
                    AI {clip.score || clip.engagement_score}%
                  </div>
                  <div className="clip-duration-badge">
                    {clip.duration}s
                  </div>
                  <div className="play-overlay">
                    <div className="play-btn">
                      <Play size={20} fill="#000" color="#000" />
                    </div>
                  </div>
                </div>

                <div className="clip-details">
                  <div className="clip-title" title={clip.title}>{clip.title}</div>
                  <div className="clip-meta">
                    <span className="badge cyan">{clip.category || 'Highlights'}</span>
                    <span>{clip.aspect_ratio || '9:16 Shorts'}</span>
                  </div>

                  <div className="clip-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveClip(clip)}
                      style={{ flex: 1 }}
                    >
                      <Play size={13} /> Preview
                    </button>
                    <a 
                      href={streamUrl}
                      download={`${clip.title}.mp4`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Download size={13} /> MP4
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeClip && (
        <VideoPlayerModal 
          clip={activeClip} 
          onClose={() => setActiveClip(null)} 
          onDelete={async (id) => {
            try {
              await api.deleteClip(id);
              setClips(prev => prev.filter(c => c.id !== id));
              setSelectedIds(prev => prev.filter(i => i !== id));
            } catch (err) {
              alert('Failed to delete clip: ' + err.message);
            }
          }}
        />
      )}
    </div>
  );
}
