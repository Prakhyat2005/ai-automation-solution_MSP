import os
import json
import uuid
import bcrypt
from typing import Dict, Any, List, Optional

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")


def _ensure_store_exists() -> None:
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump({"users": []}, f)


def load_users() -> List[Dict[str, Any]]:
    _ensure_store_exists()
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data.get("users", [])


def save_users(users: List[Dict[str, Any]]) -> None:
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump({"users": users}, f, indent=2)


def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    email_lower = email.strip().lower()
    for u in load_users():
        if u.get("email", "").lower() == email_lower:
            return u
    return None


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False


def add_user(email: str, password: str, name: str, role: str, company: Optional[str] = None) -> Dict[str, Any]:
    users = load_users()
    if find_user_by_email(email):
        raise ValueError("User already exists")
    user = {
        "id": str(uuid.uuid4()),
        "email": email.strip().lower(),
        "name": name,
        "role": role,
        "company": company,
        "password_hash": hash_password(password),
        "created_at": uuid.uuid1().time,  # simple timestamp surrogate
    }
    users.append(user)
    save_users(users)
    return user