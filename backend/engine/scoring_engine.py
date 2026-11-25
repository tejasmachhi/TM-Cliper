from config import DEFAULT_WEIGHTS, GAME_PROFILES

def compute_second_by_second_scores(
    audio_scores: list,
    visual_scores: list,
    weights: dict = None,
    game: str = "GTA V"
) -> list:
    """Combines multi-modal signals into a unified AI excitement curve (0-100%)."""
    if not weights:
        weights = DEFAULT_WEIGHTS

    w_gameplay = weights.get("gameplay", 30) / 100.0
    w_audio = weights.get("audio", 20) / 100.0
    w_chat = weights.get("chat", 20) / 100.0
    w_visual = weights.get("visual", 15) / 100.0
    w_speech = weights.get("speech", 10) / 100.0
    w_uniqueness = weights.get("uniqueness", 5) / 100.0

    # Map audio by integer timestamp
    audio_map = {int(round(item["timestamp"])): item["score"] for item in audio_scores}
    visual_map = {int(round(item["timestamp"])): item["score"] for item in visual_scores}

    max_t = max(list(audio_map.keys()) + list(visual_map.keys()) + [0])
    combined_timeline = []

    for t in range(max_t + 1):
        a_score = audio_map.get(t, 0.2)
        v_score = visual_map.get(t, 0.2)

        # Game-profile specific bonus for sudden spikes
        profile = GAME_PROFILES.get(game, GAME_PROFILES["General"])
        gameplay_action = min(1.0, (a_score * 0.6 + v_score * 0.7))

        # Simulated live chat reaction correlated with excitement
        chat_reaction = min(1.0, a_score * 0.9 + 0.1)

        # Speech emotional peak
        speech_emotion = min(1.0, a_score * 1.1)

        # Total combined score (0 - 100)
        total_score = (
            gameplay_action * w_gameplay +
            a_score * w_audio +
            chat_reaction * w_chat +
            v_score * w_visual +
            speech_emotion * w_speech +
            0.8 * w_uniqueness
        ) * 100.0

        combined_timeline.append({
            "timestamp": t,
            "total_score": round(float(total_score), 1),
            "audio": round(float(a_score * 100), 1),
            "visual": round(float(v_score * 100), 1),
            "gameplay": round(float(gameplay_action * 100), 1)
        })

    return combined_timeline

def extract_highlight_segments(
    timeline: list,
    min_score: int = 70,
    target_duration: int = 30,
    max_clips: int = 5,
    game: str = "GTA V"
) -> list:
    """Identifies peak excitement moments and calculates non-overlapping clip cuts."""
    profile = GAME_PROFILES.get(game, GAME_PROFILES["General"])
    pre_roll = profile.get("pre_roll_sec", 4.0)
    post_roll = profile.get("post_roll_sec", 5.0)

    # Find peaks above min_score
    peaks = [point for point in timeline if point["total_score"] >= min_score]
    if not peaks:
        # Fall back to top score points if none crossed the min_score
        sorted_points = sorted(timeline, key=lambda x: x["total_score"], reverse=True)
        peaks = sorted_points[:max_clips * 2]

    # Sort peaks by score descending
    peaks.sort(key=lambda x: x["total_score"], reverse=True)

    selected_segments = []

    for peak in peaks:
        peak_t = peak["timestamp"]
        half_dur = target_duration / 2.0
        start_t = max(0.0, peak_t - half_dur - pre_roll)
        end_t = start_t + target_duration

        # Check overlap with already chosen segments
        overlaps = False
        for seg in selected_segments:
            if not (end_t <= seg["start_time"] or start_t >= seg["end_time"]):
                overlaps = True
                break

        if not overlaps:
            # Pick title based on game profile
            if game == "GTA V":
                titles = [
                    "INSANE CAR CHASE ESCAPE & COP SLAM",
                    "CRAZY EXPLOSION & STUNT JUMP",
                    "FUNNIEST NPC MOTORCYCLE COLLISION",
                    "5-STAR WANTED LEVEL RUNAWAY CLUTCH"
                ]
            elif game == "Valorant":
                titles = [
                    "4K ACE & SPARK CLUTCH DEFUSE",
                    "INSANE HEADSHOT SNIPER FLICK",
                    "1v3 IMPOSSIBLE SITE RETAKE",
                    "CRAZY TEAM REACTION & CLUTCH"
                ]
            else:
                titles = [
                    "UNREAL HIGHLIGHT MOMENT #shorts",
                    "INSANE GAMEPLAY CLUTCH #shorts",
                    "HIGH ENERGY GAMING MOMENT #shorts"
                ]

            title_idx = len(selected_segments) % len(titles)
            chosen_title = titles[title_idx]

            selected_segments.append({
                "title": f"{chosen_title} #shorts",
                "start_time": round(start_t, 1),
                "end_time": round(end_t, 1),
                "duration": round(end_t - start_t, 1),
                "score": int(round(peak["total_score"])),
                "event_type": "Explosion & High Audio Intensity" if game == "GTA V" else "Elimination Spike"
            })

            if len(selected_segments) >= max_clips:
                break

    return selected_segments
