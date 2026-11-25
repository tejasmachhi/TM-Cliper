'use client';

import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Sparkles, 
  Film, 
  FileArchive, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Edit2, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchProjects = () => {
    api.getProjects()
      .then(res => {
        if (res && res.projects) setProjects(res.projects);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.renameProject(id, editName.trim());
      setProjects(prev => prev.map(p => p.id === id ? { ...p, project_name: editName.trim() } : p));
      setEditingId(null);
    } catch (err) {
      alert('Rename failed: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This removes all rendered clips and media files.`)) return;
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.source_url && p.source_url.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>My Video Projects</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your processed video links, AI jobs, and download rendered clip packages.
          </p>
        </div>

        <Link href="/create" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontWeight: 700 }}>
          <Sparkles size={14} /> + New AI Project
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input 
            type="text"
            placeholder="Search projects by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px', borderRadius: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={15} color="#64748b" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="modern-select"
          >
            <option value="ALL">All Project Statuses</option>
            <option value="completed">Completed (Ready)</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <FolderKanban size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No projects found</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Paste a YouTube link to generate your first batch of AI clips.</p>
              <Link href="/create" className="btn btn-primary btn-sm" style={{ borderRadius: '9999px' }}>
                Create First Project
              </Link>
            </div>
          ) : (
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Project Name / Video</th>
                  <th>Source</th>
                  <th>Duration</th>
                  <th>Clips</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {editingId === p.id ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ padding: '4px 8px', fontSize: '13px' }}
                            autoFocus
                          />
                          <button onClick={() => handleRename(p.id)} className="btn btn-primary btn-sm" style={{ padding: '4px 10px' }}>
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.project_name}
                            </span>
                            <button 
                              onClick={() => { setEditingId(p.id); setEditName(p.project_name); }}
                              style={{ color: '#64748b', cursor: 'pointer' }}
                              title="Rename project"
                            >
                              <Edit2 size={13} />
                            </button>
                          </div>
                          {p.source_url && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              <a href={p.source_url} target="_blank" rel="noreferrer" style={{ color: '#00e5ff' }}>
                                View Source Video ↗
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge cyan">{p.source_type.toUpperCase()}</span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>
                      {Math.floor(p.video_duration / 60)}m {p.video_duration % 60}s
                    </td>
                    <td>
                      <strong style={{ color: '#00e5ff' }}>{p.clip_count} clips</strong>
                    </td>
                    <td>
                      {p.status === 'completed' ? (
                        <span className="badge green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Ready
                        </span>
                      ) : p.status === 'processing' ? (
                        <span className="badge amber">
                          {p.progress || 15}% Processing
                        </span>
                      ) : (
                        <span className="badge purple">{p.status}</span>
                      )}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>{p.created_at}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Link href="/clip-library" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '12px' }}>
                          Clips
                        </Link>
                        {p.status === 'completed' && (
                          <a 
                            href={api.getProjectZipUrl(p.id)} 
                            download 
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            title="Download All Clips in ZIP"
                          >
                            <FileArchive size={13} /> ZIP
                          </a>
                        )}
                        <button 
                          onClick={() => handleDelete(p.id, p.project_name)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Delete Project & Storage"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
