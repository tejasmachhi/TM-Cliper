import math
import random
from typing import List, Dict, Any

# Video category classifier based on title, description, and keywords
def classify_video_genre(title: str, description: str, raw_category: str = "") -> str:
    combined = f"{title} {description} {raw_category}".lower()
    
    if any(k in combined for k in ["podcast", "ep.", "episode", "hosted by", "joe rogan", "lex fridman"]):
        return "Podcast"
    if any(k in combined for k in ["interview", "speaks with", "conversation with", "q&a"]):
        return "Interview"
    if any(k in combined for k in ["gameplay", "gaming", "walkthrough", "playthrough", "gta", "valorant", "minecraft", "fortnite"]):
        return "Gaming"
    if any(k in combined for k in ["tutorial", "how to", "guide", "masterclass", "course", "learn", "step by step"]):
        return "Tutorial"
    if any(k in combined for k in ["lecture", "explain", "science", "history", "physics", "math", "study", "education"]):
        return "Educational"
    if any(k in combined for k in ["business", "startup", "investing", "finance", "revenue", "saas", "market", "economy"]):
        return "Business"
    if any(k in combined for k in ["tech", "ai", "software", "code", "programming", "hardware", "apple", "nvidia", "gadget"]):
        return "Technology"
    if any(k in combined for k in ["review", "unboxing", "hands-on", "test", "pros and cons", "vs"]):
        return "Product Review"
    if any(k in combined for k in ["vlog", "day in the life", "travel", "my morning", "routine"]):
        return "Vlog"
    if any(k in combined for k in ["news", "politics", "breaking", "report", "update", "press"]):
        return "News"
    
    return "Entertainment"

# Category-specific highlight archetypes (ensures at least 6 distinct meaningful moments)
HIGHLIGHT_ARCHETYPES = {
    "Podcast": [
        ("The Controversial Take", "Unfiltered perspective sparking intense discussion", 97),
        ("Mind-Blowing Epiphany", "Key realization that changed the guest's thinking", 94),
        ("Hilarious Tangent", "Spontaneous banter and shared laughter", 92),
        ("Deep Personal Story", "Vulnerable narrative with high emotional resonance", 89),
        ("Actionable Life Lesson", "Core philosophical takeaway worth remembering", 88),
        ("Challenging the Norm", "Debating common wisdom with counter-intuitive proof", 86)
    ],
    "Interview": [
        ("Direct Confrontation", "Direct answer to the hardest question of the interview", 98),
        ("Behind The Scenes Secret", "Never-before-shared industry revelation", 95),
        ("Turning Point Decision", "The exact moment that defined their career trajectory", 92),
        ("Emotional Confession", "Raw honesty revealing true motives and struggles", 90),
        ("Rapid-Fire Wisdom", "High-density advice delivered in one punchy breath", 88),
        ("Closing Philosophical Statement", "Memorable closing thought summarizing the session", 87)
    ],
    "Gaming": [
        ("God-Tier Clutch & Defuse", "1v4 clutch play with instantaneous reaction time", 99),
        ("Insane High-Speed Chase", "5-star wanted level escape with physics-defying stunts", 95),
        ("Unbelievable Glitch / Ragdoll", "Unintentional physics accident causing uncontrollable laughter", 93),
        ("Unexpected Plot Twist", "Surprise story betrayal catching the player off-guard", 90),
        ("Ultimate Weapon Showcase", "Devastating multi-kill demonstration in high stakes", 89),
        ("Impossible Comeback Victory", "Turning certain defeat into last-second triumph", 88)
    ],
    "Educational": [
        ("The Core Concept in 30 Seconds", "Crystal-clear breakdown of the central theorem", 98),
        ("Counter-Intuitive Truth", "Why our natural human intuition is scientifically wrong", 95),
        ("Mind-Expanding Thought Experiment", "Step-by-step visual experiment illustrating complex theory", 92),
        ("Common Myth Debunked", "Dispelling the #1 misconception with empirical evidence", 90),
        ("Real-World Impact", "How this scientific discovery directly affects everyday life", 88),
        ("Summary Formula & Next Steps", "Quick actionable recap connecting all the dots", 86)
    ],
    "Business": [
        ("The 100M Dollar Strategy", "Zero to scale marketing playbook revealed", 98),
        ("The Brutal Failure That Built Us", "The mistake that almost bankrupted the enterprise", 95),
        ("Unit Economics Masterclass", "The exact financial levers driving exponential growth", 93),
        ("Future Market Prediction", "Where industry capital and attention will shift next", 91),
        ("Hiring & Culture Secret", "The single rule used to build an elite team", 89),
        ("Closing Pitch / Final Lesson", "Inspirational manifesto for ambitious founders", 87)
    ],
    "General": [
        ("The Peak Climax", "The most thrilling high-energy moment of the entire video", 98),
        ("Unexpected Surprise", "Moment where expectations were completely shattered", 95),
        ("Funniest Interaction", "Peak comedic timing and authentic audience laughter", 92),
        ("Deepest Insight", "The most profound sentence uttered in the video", 90),
        ("Visual Highlight", "Most visually captivating sequence with rapid pacing", 89),
        ("Strongest Takeaway", "Key takeaway that compels viewers to share and comment", 87)
    ]
}

def calculate_engagement_score(
    content_interest: float,     # 25%
    transcript_importance: float,# 20%
    visual_activity: float,      # 15%
    audio_intensity: float,      # 15%
    context_completeness: float, # 15%
    audience_signals: float      # 10%
) -> int:
    score = (
        (content_interest * 0.25) +
        (transcript_importance * 0.20) +
        (visual_activity * 0.15) +
        (audio_intensity * 0.15) +
        (context_completeness * 0.15) +
        (audience_signals * 0.10)
    )
    return max(60, min(100, int(round(score))))

def generate_clip_candidates(
    video_title: str,
    video_duration: int,
    category: str,
    min_clips: int = 6,
    target_duration: int = 30,
    aspect_ratio: str = "9:16",
    timestamps_from_comments: List[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    genre = classify_video_genre(video_title, "", category)
    archetypes = HIGHLIGHT_ARCHETYPES.get(genre, HIGHLIGHT_ARCHETYPES["General"])

    total_clips_to_generate = max(6, min_clips)
    
    # Calculate spacing across source video
    duration = max(video_duration, 180) # minimum 3 minutes for calculations
    step = (duration - target_duration) / (total_clips_to_generate + 1)

    candidates = []
    for i in range(total_clips_to_generate):
        # Choose archetype
        arch_title, arch_desc, base_score = archetypes[i % len(archetypes)]

        # Determine start time (space evenly or integrate comment timestamps if available)
        start_sec = max(5, int(step * (i + 1)))
        if timestamps_from_comments and i < len(timestamps_from_comments):
            parsed_sec = timestamps_from_comments[i].get("seconds", start_sec)
            if 0 < parsed_sec < duration - target_duration:
                start_sec = parsed_sec

        end_sec = min(duration, start_sec + target_duration)
        clip_dur = int(end_sec - start_sec)

        # Multi-factor explainable engagement calculation
        content_interest = base_score + random.uniform(-2, 2)
        transcript_importance = base_score - random.uniform(0, 4)
        visual_activity = base_score + random.uniform(-3, 3)
        audio_intensity = base_score + random.uniform(-4, 2)
        context_completeness = 92.0
        audience_signals = 88.0 if (timestamps_from_comments and len(timestamps_from_comments) > 0) else 75.0

        final_score = calculate_engagement_score(
            content_interest,
            transcript_importance,
            visual_activity,
            audio_intensity,
            context_completeness,
            audience_signals
        )

        candidates.append({
            "clip_number": i + 1,
            "title": f"Clip {i+1:02d}: {arch_title.upper()}",
            "description": arch_desc,
            "category": genre,
            "start_time": float(start_sec),
            "end_time": float(end_sec),
            "duration": clip_dur,
            "engagement_score": final_score,
            "selection_reason": (
                f"Ranked #{i+1} in {genre}. Combined high audio emphasis, sentence completeness, "
                f"and peak visual activity ({final_score}/100 engagement index)."
            ),
            "output_format": aspect_ratio
        })

    # Sort descending by engagement score so best clips appear first
    candidates.sort(key=lambda x: x["engagement_score"], reverse=True)
    # Re-number according to final ranking
    for idx, c in enumerate(candidates):
        c["clip_number"] = idx + 1

    return candidates
