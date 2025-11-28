"""
Admin authentication and authorization utilities
"""

from fastapi import HTTPException, status, Header
from typing import Optional
from datetime import datetime

from core.security import decode_access_token, create_access_token
from core.config import settings


def get_admin_from_token(authorization: Optional[str]) -> dict:
    """
    Extract and verify admin from JWT token
    Raises 401 if invalid or not an admin
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if this is an admin token
    if not payload.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return payload


def require_super_admin(authorization: Optional[str]) -> dict:
    """
    Verify user is a super admin
    Raises 403 if not super admin
    """
    admin = get_admin_from_token(authorization)
    
    if admin.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    
    return admin


async def log_admin_activity(admin_id: str, action: str, target_type: str, target_id: Optional[str] = None, details: Optional[dict] = None):
    """
    Log admin activity for audit trail
    """
    from core.database import supabase
    
    log_entry = {
        "admin_id": admin_id,
        "action": action,
        "target_type": target_type,
        "target_id": target_id,
        "details": details
    }
    
    supabase.table("admin_activity_log").insert(log_entry).execute()