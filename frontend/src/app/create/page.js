'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  Eye,
  CheckCircle2,
  Clock,
  Film,
  Download,
  FileArchive,
  Layers,
  Sliders,
  Play,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Share2
} from 'lucide-react';
import { api } from '@/utils/api';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import UploadToYouTubeModal from '@/components/UploadToYouTubeModal';
import YouTubeLogo from '@/components/YouTubeLogo';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function CreateClipsPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Input URL, 2: Preview & Confirm, 3: Processing, 4: Results
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewError, setPreviewError] = useState('');

  // Configuration options
  const [confirmedRights, setConfirmedRights] = useState(true);
  const [minClips, setMinClips] = useState(6);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [targetDuration, setTargetDuration] = useState(30);

  // Processing state
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStage, setJobStage] = useState('Initializing AI Pipeline...');
  const [jobStatus, setJobStatus] = useState('queued');

  // Results
  const [generatedClips, setGeneratedClips] = useState([]);
  const [activePreviewClip, setActivePreviewClip] = useState(null);
  const [uploadingClip, setUploadingClip] = useState(null);

  const handlePublishClip = (clip) => {
    setUploadingClip(clip);
  };

  // Handle Step 1: Preview YouTube URL
  const handlePreviewLink = async (e) => {
    e?.preventDefault();
    if (!youtubeUrl.trim()) return;

    setLoadingPreview(true);
    setPreviewError('');
    try {
      const res = await api.previewYoutube(youtubeUrl.trim());
      if (res && res.metadata) {
        setPreviewData(res.metadata);
        setStep(2);
      }
    } catch (err) {
      setPreviewError(err.message || 'Failed to retrieve YouTube metadata.');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Handle Step 2 -> 3: Launch AI Processing
  const handleLaunchAnalysis = async () => {
    if (!confirmedRights) {
      toast.warning('Please confirm that you have permission to process this video.');
      return;
    }

    setStep(3);
    setJobProgress(10);
    setJobStage('Validating authorized video source...');

    try {
      const res = await api.createProject({
        source_url: youtubeUrl.trim(),
        source_type: 'youtube',
        project_name: previewData?.title || 'YouTube Highlights',
        confirmed_rights: confirmedRights,
        aspect_ratio: aspectRatio,
        min_clips: Number(minClips),
        target_duration: Number(targetDuration),
        download_source: true
      });

      if (res && res.project_id) {
        setCurrentProjectId(res.project_id);
      }
    } catch (err) {
      toast.error(err.message || 'Error initiating project');
      setStep(2);
    }
  };

  // Poll Project Processing Status
  useEffect(() => {
    if (step !== 3 || !currentProjectId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.getProject(currentProjectId);
        if (res && res.job) {
          setJobProgress(res.job.progress || 10);
          setJobStage(res.job.stage || 'Analyzing video signals...');
          setJobStatus(res.job.status);

          if (res.job.status === 'completed' && res.clips && res.clips.length > 0) {
            setGeneratedClips(res.clips);
            setStep(4);
            clearInterval(interval);
          } else if (res.job.status === 'failed') {
            alert('Processing error: ' + (res.job.error || 'Unknown error'));
            setStep(2);
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.log('Poll status error:', e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, currentProjectId]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Wizard Progress Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--card-shadow)', flexWrap: 'wrap', gap: '12px' }}>
        {[
          { num: 1, title: 'Paste Video' },
          { num: 2, title: 'Verify & Configure' },
          { num: 3, title: 'AI Analysis' },
          { num: 4, title: '6+ Generated Clips' }
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= s.num ? 1 : 0.4 }}>
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '50%', 
              background: step === s.num ? 'var(--text-primary)' : step > s.num ? '#16a34a' : 'var(--pill-bg)', 
              color: step === s.num ? 'var(--bg-primary)' : step > s.num ? '#ffffff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' 
            }}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{ fontSize: '13px', fontWeight: step === s.num ? 700 : 500, color: step === s.num ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Paste Link */}
      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={20} color="#2563eb" />
              <span>Step 1 — Paste YouTube Video URL</span>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Enter any supported YouTube URL (Podcast, Gaming, Interview, Educational, Tech, Tutorial, Business). 
              TM Cliper validates the link, retrieves official metadata, and extracts at least six high-scoring viral moments.
            </p>

            <form onSubmit={handlePreviewLink} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <div style={{ position: 'absolute', left: '14px', top: '13px' }}>
                  <YouTubeLogo size={18} />
                </div>
                <input 
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px 12px 48px', 
                    borderRadius: '9999px', 
                    border: '1.5px solid var(--border-color)', 
                    background: 'var(--bg-input)', 
                    color: 'var(--text-primary)', 
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loadingPreview}
                style={{ padding: '0 26px', fontSize: '14px', fontWeight: 700, borderRadius: '9999px' }}
              >
                {loadingPreview ? (
                  <><RefreshCw size={16} className="spin" /> Analyzing URL...</>
                ) : (
                  <><Sparkles size={16} /> Analyze Moments <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {previewError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{previewError}</span>
              </div>
            )}

            <div style={{ padding: '16px', background: 'var(--pill-bg)', borderRadius: '12px', border: '1.5px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Example URLs to Test:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')} 
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Rick Astley - Never Gonna Give You Up (Music/Entertainment)
                </button>
                <button 
                  type="button" 
                  onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw')} 
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Me at the zoo (Vlog / History)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Preview & Configuration */}
      {step === 2 && previewData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Eye size={20} color="#00e5ff" />
                <span>Step 2 — Video Metadata & Embedded Preview</span>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-secondary btn-sm">
                Change URL
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '160px', background: '#000' }}>
                  <img
                    src={previewData.thumbnail}
                    alt={previewData.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.85)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    {Math.floor(previewData.duration / 60)}m {previewData.duration % 60}s
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: '1.4', margin: 0 }}>
                    {previewData.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
                    <span>Channel: <strong style={{ color: '#0f172a' }}>{previewData.channel_name}</strong></span>
                    <span>Category: <strong style={{ color: '#2563eb' }}>{previewData.category}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} /> {previewData.view_count.toLocaleString()} views
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={14} /> {previewData.like_count.toLocaleString()} likes
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageSquare size={14} /> {previewData.comment_count.toLocaleString()} comments
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', maxHeight: '50px', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {previewData.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Legal & Ownership Confirmation */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="confirmRights"
                  checked={confirmedRights}
                  onChange={(e) => setConfirmedRights(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#0f172a', cursor: 'pointer' }}
                />
                <label htmlFor="confirmRights" style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', lineHeight: '2', fontWeight: 500 }}>
                  <ShieldCheck size={16} color="#16a34a" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  I confirm that I own this content or have authorization/license to process and generate highlights from this video.
                </label>
              </div>

              {/* AI Clipping Settings */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Clips to Generate (At least 6)
                  </label>
                  <select
                    value={minClips}
                    onChange={(e) => setMinClips(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#ffffff', border: '2px solid #cbd5e1', color: '#0f172a', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="6">6 Clips (Standard AI Package)</option>
                    <option value="8">8 Clips (Extended Highlights)</option>
                    <option value="10">10 Clips (Pro Creator Pack)</option>
                    <option value="15">15 Clips (Full Coverage)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Output Format / Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#ffffff', border: '2px solid #cbd5e1', color: '#0f172a', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="9:16">9:16 Vertical (Shorts, Reels, TikTok)</option>
                    <option value="16:9">16:9 Landscape (Standard YouTube)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Target Clip Length
                  </label>
                  <select
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#ffffff', border: '2px solid #cbd5e1', color: '#0f172a', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="15">15 Seconds (Punchy hook)</option>
                    <option value="30">30 Seconds (Optimal Shorts length)</option>
                    <option value="45">45 Seconds (Detailed moment)</option>
                    <option value="60">60 Seconds (Full segment)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={handleLaunchAnalysis}
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', fontSize: '15px', fontWeight: 700, background: 'linear-gradient(90deg, #00e5ff, #9d4edd)' }}
                >
                  <Sparkles size={18} /> Launch AI Analysis & Create {minClips} Clips
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Live Processing Screen */}
      {step === 3 && (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', border: '2px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <RefreshCw size={28} color="#00e5ff" className="spin" />
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>AI Video Engine in Progress</h2>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                Analyzing video context, transcript boundaries, audio spikes, and visual scene activity.
              </p>
            </div>

            {/* Real Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${jobProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00e5ff, #9d4edd)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#00e5ff', fontWeight: 600 }}>{jobStage}</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{jobProgress}%</span>
              </div>
            </div>

            {/* Stage Checklist */}
            <div style={{ textAlign: 'left', background: '#0a0e17', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ color: jobProgress >= 20 ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> 1. Video validation & official metadata extraction
              </div>
              <div style={{ color: jobProgress >= 40 ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> 2. Speech transcription & sentence boundary detection
              </div>
              <div style={{ color: jobProgress >= 65 ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> 3. Scene change & emotional audio frequency scoring
              </div>
              <div style={{ color: jobProgress >= 85 ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> 4. Ranking best {minClips} moments (0-100 engagement score)
              </div>
              <div style={{ color: jobProgress >= 95 ? '#22c55e' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> 5. FFmpeg smart vertical crop & thumbnail rendering
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b' }}>
              You can navigate to other tabs while processing continues asynchronously in the backend.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: Results Display (6+ Clips) */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>AI Highlights Generated ({generatedClips.length} Clips)</h2>
                <span className="badge green">All Ranked & Ready</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Moments detected using multi-factor engagement analysis (Content, Transcripts, Audio, Visuals & Audience Feedback).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentProjectId && (
                <a
                  href={api.getProjectZipUrl(currentProjectId)}
                  download
                  className="btn btn-primary"
                  style={{ background: '#22c55e', borderColor: '#22c55e', fontWeight: 700 }}
                >
                  <FileArchive size={16} /> Download All as ZIP
                </a>
              )}
              <button
                onClick={() => { setStep(1); setYoutubeUrl(''); setPreviewData(null); }}
                className="btn btn-secondary btn-sm"
              >
                + New Project
              </button>
            </div>
          </div>

          {/* Clips Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {generatedClips.map((clip) => (
              <div
                key={clip.id}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Thumbnail & Score Header */}
                <div
                  style={{ position: 'relative', height: '160px', background: '#0a0e17', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => setActivePreviewClip(clip)}
                >
                  <img
                    src={api.getMediaUrl(clip.thumbnail_url || `/api/clips/${clip.id}/thumbnail`)}
                    alt={clip.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={40} color="#334155" />
                  </div>

                  {/* Overlay Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.85)', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    Clip #{clip.clip_number}
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: clip.engagement_score >= 90 ? '#ff3366' : '#9d4edd', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, color: '#fff' }}>
                    AI Score: {clip.engagement_score}/100
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#94a3b8' }}>
                    {clip.duration}s
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,229,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={18} fill="#000" color="#000" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between', background: '#ffffff' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px', color: '#0f172a', lineHeight: '1.4' }}>
                      {clip.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {clip.description}
                    </p>
                    <div style={{ fontSize: '11px', color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', fontWeight: 500 }}>
                      {clip.selection_reason}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button
                      onClick={() => setActivePreviewClip(clip)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Play size={13} /> Preview
                    </button>
                    <a
                      href={api.getClipStreamUrl(clip.id)}
                      download={`${clip.title}.mp4`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Download size={13} /> MP4
                    </a>
                  </div>

                  <button
                    onClick={() => handlePublishClip(clip)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', marginTop: '6px', borderColor: 'rgba(255, 0, 0, 0.3)' }}
                    title="Publish directly to YouTube Shorts"
                  >
                    <YouTubeLogo size={13} /> Publish to Shorts
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activePreviewClip && (
        <VideoPlayerModal
          clip={activePreviewClip}
          onClose={() => setActivePreviewClip(null)}
          onDelete={() => { }}
        />
      )}

      {/* Upload to YouTube Modal Dialog */}
      {uploadingClip && (
        <UploadToYouTubeModal
          clip={uploadingClip}
          onClose={() => setUploadingClip(null)}
          onSuccess={(res) => {
            toast.success(`Published "${uploadingClip.title}" to YouTube Shorts!`, 'Published', res.youtube_url);
          }}
        />
      )}
    </div>
  );
}
