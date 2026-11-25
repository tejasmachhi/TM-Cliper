import time

class LiveChatAnalyzer:
    """Analyzes authorized YouTube live stream chat messages for reaction spikes."""
    
    EXCITEMENT_WORDS = {
        "pog", "poggers", "w", "ww", "www", "lol", "lmao", "omg", "omfg",
        "clutch", "insane", "hax", "aimbot", "gg", "wtfff", "dead", "nooo", "clip"
    }

    def __init__(self):
        self.message_history = [] # list of (timestamp, message_text)

    def record_message(self, text: str):
        self.message_history.append((time.time(), text.lower()))

    def get_current_chat_velocity(self, window_sec: float = 30.0) -> dict:
        """Returns messages per minute and excitement ratio in recent window."""
        now = time.time()
        # Keep only recent
        self.message_history = [
            (t, txt) for (t, txt) in self.message_history if now - t <= window_sec
        ]

        count = len(self.message_history)
        if count == 0:
            return {"msgs_per_min": 0, "excitement_ratio": 0.0}

        msgs_per_min = int(count * (60.0 / window_sec))
        
        # Calculate excitement keywords
        excited_count = 0
        for _, txt in self.message_history:
            tokens = set(txt.split())
            if tokens & self.EXCITEMENT_WORDS:
                excited_count += 1

        excitement_ratio = excited_count / count

        return {
            "msgs_per_min": msgs_per_min,
            "excitement_ratio": round(excitement_ratio, 2)
        }

live_chat_analyzer = LiveChatAnalyzer()
