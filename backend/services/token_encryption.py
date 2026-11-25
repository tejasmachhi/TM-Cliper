import os
from pathlib import Path
from cryptography.fernet import Fernet

try:
    from backend.config import CREDENTIALS_DIR
except ImportError:
    from config import CREDENTIALS_DIR

KEY_FILE = CREDENTIALS_DIR / "token_encryption.key"

def _get_or_create_key() -> bytes:
    # 1. Check environment variable
    env_key = os.getenv("GOOGLE_TOKEN_ENCRYPTION_KEY")
    if env_key:
        return env_key.encode().strip()
    
    # 2. Check disk file
    if KEY_FILE.exists():
        try:
            with open(KEY_FILE, "rb") as f:
                key = f.read().strip()
                if key:
                    return key
        except Exception:
            pass

    # 3. Generate and persist new Fernet key
    new_key = Fernet.generate_key()
    try:
        KEY_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(KEY_FILE, "wb") as f:
            f.write(new_key)
    except Exception:
        pass
    return new_key

_FERNET_INSTANCE = None

def get_fernet() -> Fernet:
    global _FERNET_INSTANCE
    if _FERNET_INSTANCE is None:
        key = _get_or_create_key()
        _FERNET_INSTANCE = Fernet(key)
    return _FERNET_INSTANCE

def encrypt_token(plain_token: str) -> str:
    """Encrypts a token string at rest."""
    if not plain_token:
        return ""
    f = get_fernet()
    encrypted_bytes = f.encrypt(plain_token.encode("utf-8"))
    return encrypted_bytes.decode("utf-8")

def decrypt_token(encrypted_token: str) -> str:
    """Decrypts an encrypted token string."""
    if not encrypted_token:
        return ""
    f = get_fernet()
    decrypted_bytes = f.decrypt(encrypted_token.encode("utf-8"))
    return decrypted_bytes.decode("utf-8")
