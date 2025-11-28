"""
Admin API Endpoints
Full control panel for managing the platform
"""

from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional
from datetime import timedelta

from models.admin import (
    AdminLogin,
    AdminCreate,
    AdminResponse,
    AdminUpdate,
    AdminToken,
    UserCreateByAdmin,
    ActivityLogResponse
)
from models.user import UserResponse
from core.security import hash_password, verify_password, create_access_token
from core.admin_auth import get_admin_from_token, require_super_admin, log_admin_activity
from core.database import (
    get_admin_by_email,
    get_admin_by_id,
    create_admin_in_db,
    update_admin_last_login,
    get_all_admins,
    update_admin_in_db,
    delete_admin_from_db,
    get_admin_activity_logs,
    create_user_in_db,
    get_all_users,
    get_user_by_id,
    delete_user_from_db,
    update_user_in_db,
    get_user_by_email
)
from core.config import settings

router = APIRouter(prefix="/admin", tags=["Admin"])


# ========================================
# ADMIN AUTHENTICATION
# ========================================

@router.post("/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    """
    Admin login - returns JWT token with admin privileges
    """
    # Find admin by email
    admin = await get_admin_by_email(credentials.email)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if admin is active
    if not admin.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is deactivated"
        )
    
    # Verify password
    if not verify_password(credentials.password, admin["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    await update_admin_last_login(admin["id"])
    
    # Create admin token with special flag
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "user_id": admin["id"],
            "email": admin["email"],
            "role": admin["role"],
            "is_admin": True  # Special flag for admin tokens
        },
        expires_delta=access_token_expires
    )
    
    # Log activity
    await log_admin_activity(admin["id"], "login", "admin", admin["id"])
    
    return AdminToken(
        access_token=access_token,
        admin=AdminResponse(**admin)
    )


@router.get("/me", response_model=AdminResponse)
async def get_current_admin(authorization: Optional[str] = Header(None)):
    """
    Get current authenticated admin's info
    """
    admin_token = get_admin_from_token(authorization)
    admin = await get_admin_by_id(admin_token["user_id"])
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    return AdminResponse(**admin)


# ========================================
# ADMIN MANAGEMENT (Super Admin Only)
# ========================================

@router.post("/admins", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreate,
    authorization: Optional[str] = Header(None)
):
    """
    Create a new admin account (Super Admin only)
    """
    current_admin = require_super_admin(authorization)
    
    # Check if email already exists
    existing = await get_admin_by_email(admin_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(admin_data.password)
    
    # Create admin
    new_admin_data = {
        "email": admin_data.email,
        "full_name": admin_data.full_name,
        "hashed_password": hashed_password,
        "role": admin_data.role,
        "is_active": True,
        "created_by": current_admin["user_id"]
    }
    
    created_admin = await create_admin_in_db(new_admin_data)
    
    if not created_admin:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create admin"
        )
    
    # Log activity
    await log_admin_activity(
        current_admin["user_id"],
        "created_admin",
        "admin",
        created_admin["id"],
        {"email": admin_data.email, "role": admin_data.role}
    )
    
    return AdminResponse(**created_admin)


@router.get("/admins", response_model=List[AdminResponse])
async def list_admins(authorization: Optional[str] = Header(None)):
    """
    Get all admin accounts
    """
    require_super_admin(authorization)
    admins = await get_all_admins()
    return [AdminResponse(**admin) for admin in admins]


@router.put("/admins/{admin_id}", response_model=AdminResponse)
async def update_admin(
    admin_id: str,
    admin_data: AdminUpdate,
    authorization: Optional[str] = Header(None)
):
    """
    Update admin account (Super Admin only)
    """
    current_admin = require_super_admin(authorization)
    
    # Get admin
    admin = await get_admin_by_id(admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Prepare update data
    update_data = {}
    if admin_data.full_name is not None:
        update_data["full_name"] = admin_data.full_name
    if admin_data.role is not None:
        update_data["role"] = admin_data.role
    if admin_data.is_active is not None:
        update_data["is_active"] = admin_data.is_active
    
    # Update admin
    updated_admin = await update_admin_in_db(admin_id, update_data)
    
    # Log activity
    await log_admin_activity(
        current_admin["user_id"],
        "updated_admin",
        "admin",
        admin_id,
        update_data
    )
    
    return AdminResponse(**updated_admin)


@router.delete("/admins/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin(
    admin_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Delete admin account (Super Admin only)
    Cannot delete yourself
    """
    current_admin = require_super_admin(authorization)
    
    # Cannot delete yourself
    if admin_id == current_admin["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Delete admin
    success = await delete_admin_from_db(admin_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Log activity
    await log_admin_activity(
        current_admin["user_id"],
        "deleted_admin",
        "admin",
        admin_id
    )
    
    return None


# ========================================
# USER MANAGEMENT
# ========================================

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user_by_admin(
    user_data: UserCreateByAdmin,
    authorization: Optional[str] = Header(None)
):
    """
    Create a new user account (Admin function)
    """
    admin = get_admin_from_token(authorization)
    
    # Check if email already exists
    existing = await get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    new_user_data = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "bio": user_data.bio,
        "latitude": user_data.latitude,
        "longitude": user_data.longitude,
        "hashed_password": hashed_password,
        "is_active": user_data.is_active
    }
    
    created_user = await create_user_in_db(new_user_data)
    
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Log activity
    await log_admin_activity(
        admin["user_id"],
        "created_user",
        "user",
        created_user["id"],
        {"email": user_data.email}
    )
    
    return UserResponse(**created_user)


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(authorization: Optional[str] = Header(None)):
    """
    Get all users with full details (Admin function)
    """
    get_admin_from_token(authorization)
    
    # Get basic users list
    users = await get_all_users()
    
    # Fetch full details for each user
    detailed_users = []
    for user in users:
        full_user = await get_user_by_id(user.get("id"))
        if full_user:
            detailed_users.append(UserResponse(**full_user))
    
    return detailed_users


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_by_admin(
    user_id: str,
    update_data: dict,
    authorization: Optional[str] = Header(None)
):
    """
    Update user account (Admin function)
    """
    admin = get_admin_from_token(authorization)
    
    # Get user
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user
    updated_user = await update_user_in_db(user_id, update_data)
    
    # Log activity
    await log_admin_activity(
        admin["user_id"],
        "updated_user",
        "user",
        user_id,
        update_data
    )
    
    return UserResponse(**updated_user)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_admin(
    user_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Delete user account (Admin function)
    """
    admin = get_admin_from_token(authorization)
    
    # Delete user
    success = await delete_user_from_db(user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Log activity
    await log_admin_activity(
        admin["user_id"],
        "deleted_user",
        "user",
        user_id
    )
    
    return None


# ========================================
# ACTIVITY LOGS
# ========================================

@router.get("/activity-logs", response_model=List[ActivityLogResponse])
async def get_activity_logs(
    limit: int = 50,
    authorization: Optional[str] = Header(None)
):
    """
    Get admin activity logs (audit trail)
    """
    get_admin_from_token(authorization)
    logs = await get_admin_activity_logs(limit)
    return [ActivityLogResponse(**log) for log in logs]


# ========================================
# DASHBOARD STATS
# ========================================

@router.get("/stats")
async def get_dashboard_stats(authorization: Optional[str] = Header(None)):
    """
    Get platform statistics for admin dashboard
    """
    get_admin_from_token(authorization)
    
    users = await get_all_users()
    admins = await get_all_admins()
    
    # Calculate additional stats
    total_skills = 0
    active_users = 0
    
    for user in users:
        full_user = await get_user_by_id(user.get("id"))
        if full_user and full_user.get("is_active"):
            active_users += 1
    
    return {
        "total_users": len(users),
        "active_users": active_users,
        "total_admins": len(admins),
        "total_skills": total_skills,
        "platform_status": "operational"
    }