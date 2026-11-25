import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    subscription_plan = Column(String(50), default="FREE") # FREE, PRO, CREATOR
    credits = Column(Integer, default=60) # minutes available
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    clips = relationship("Clip", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    project_name = Column(String(200), nullable=False)
    source_url = Column(String(500), nullable=True)
    source_type = Column(String(50), default="youtube") # youtube, upload, local
    video_title = Column(String(300), nullable=True)
    video_duration = Column(Integer, default=0) # in seconds
    video_thumbnail = Column(String(500), nullable=True)
    video_filepath = Column(String(500), nullable=True)
    status = Column(String(50), default="created") # created, queued, processing, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="projects")
    metadata_rel = relationship("VideoMetadata", back_populates="project", uselist=False, cascade="all, delete-orphan")
    analysis_job = relationship("AnalysisJob", back_populates="project", uselist=False, cascade="all, delete-orphan")
    transcripts = relationship("Transcript", back_populates="project", cascade="all, delete-orphan")
    detection_events = relationship("DetectionEvent", back_populates="project", cascade="all, delete-orphan")
    clips = relationship("Clip", back_populates="project", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="project", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="project", cascade="all, delete-orphan")

class VideoMetadata(Base):
    __tablename__ = "video_metadata"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    channel_name = Column(String(150), default="")
    metadata_json = Column(Text, default="{}")

    project = relationship("Project", back_populates="metadata_rel")

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    job_status = Column(String(50), default="queued") # queued, processing, completed, failed
    progress = Column(Integer, default=0)
    current_stage = Column(String(200), default="Initializing")
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="analysis_job")

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)
    speaker = Column(String(100), default="Speaker 1")

    project = relationship("Project", back_populates="transcripts")

class DetectionEvent(Base):
    __tablename__ = "detection_events"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    event_category = Column(String(100), nullable=False)
    engagement_score = Column(Integer, default=80)
    explanation = Column(Text, nullable=True)

    project = relationship("Project", back_populates="detection_events")

class Clip(Base):
    __tablename__ = "clips"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    clip_number = Column(Integer, nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)
    engagement_score = Column(Integer, default=85)
    category = Column(String(100), default="Highlights")
    selection_reason = Column(Text, default="High engagement moment detected")
    output_format = Column(String(50), default="9:16")
    file_path = Column(String(500), nullable=True)
    thumbnail_path = Column(String(500), nullable=True)
    status = Column(String(50), default="ready")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="clips")
    user = relationship("User", back_populates="clips")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=False)
    comment_text = Column(Text, nullable=False)
    like_count = Column(Integer, default=0)
    published_at = Column(String(100), nullable=True)
    timestamp_reference = Column(String(50), nullable=True)

    project = relationship("Project", back_populates="comments")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    plan = Column(String(50), default="FREE") # FREE, PRO, CREATOR
    status = Column(String(50), default="active")
    billing_period = Column(String(50), default="monthly")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")

class UsageRecord(Base):
    __tablename__ = "usage_records"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    project_id = Column(String(50), ForeignKey("projects.id"), nullable=True)
    processing_minutes = Column(Float, default=0.0)
    credits_used = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="usage_records")
    project = relationship("Project", back_populates="usage_records")
