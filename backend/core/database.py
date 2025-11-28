"""
Database connection and operations using Supabase
"""

from supabase import create_client, Client
from core.config import settings
from typing import Optional
from datetime import datetime

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# === USER FUNCTIONS ===

async def create_user_in_db(user_data: dict) -> dict:
    """
    Create a new user in the database
    Returns: Created user data
    """
    response = supabase.table("users").insert(user_data).execute()
    return response.data[0] if response.data else None


async def get_user_by_email(email: str) -> Optional[dict]:
    """
    Fetch user by email
    Returns: User data or None
    """
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Fetch user by ID
    Returns: User data or None
    """
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    return response.data[0] if response.data else None


async def get_all_users() -> list:
    """
    Get all users (for debugging)
    Returns: List of users
    """
    response = supabase.table("users").select("id, email, full_name, created_at").execute()
    return response.data if response.data else []


async def update_user_location(user_id: str, latitude: float, longitude: float) -> dict:
    """
    Update user's geolocation (for matching in Phase 7)
    Returns: Updated user data
    """
    response = supabase.table("users").update({
        "latitude": latitude,
        "longitude": longitude
    }).eq("id", user_id).execute()
    return response.data[0] if response.data else None


async def delete_user_from_db(user_id: str) -> bool:
    """
    Delete user account (admin function)
    Returns: True if successful
    """
    response = supabase.table("users").delete().eq("id", user_id).execute()
    return len(response.data) > 0 if response.data else False


async def update_user_in_db(user_id: str, update_data: dict) -> dict:
    """
    Update user account (admin function)
    Returns: Updated user data
    """
    response = supabase.table("users").update(update_data).eq("id", user_id).execute()
    return response.data[0] if response.data else None


# === SKILL CATEGORY FUNCTIONS ===

async def get_all_skill_categories() -> list:
    """
    Get all available skill categories
    Returns: List of skill categories
    """
    response = supabase.table("skill_categories").select("*").order("name").execute()
    return response.data if response.data else []


async def get_skill_category_by_id(category_id: str) -> Optional[dict]:
    """
    Get a specific skill category
    Returns: Category data or None
    """
    response = supabase.table("skill_categories").select("*").eq("id", category_id).execute()
    return response.data[0] if response.data else None


# === USER SKILL FUNCTIONS ===

async def create_user_skill(skill_data: dict) -> dict:
    """
    Add a skill to user's profile
    Returns: Created skill data
    """
    response = supabase.table("user_skills").insert(skill_data).execute()
    return response.data[0] if response.data else None


async def get_user_skills(user_id: str) -> list:
    """
    Get all skills for a specific user
    Returns: List of user skills
    """
    response = supabase.table("user_skills").select("*").eq("user_id", user_id).execute()
    return response.data if response.data else []


async def get_skill_by_id(skill_id: str) -> Optional[dict]:
    """
    Get a specific skill by ID
    Returns: Skill data or None
    """
    response = supabase.table("user_skills").select("*").eq("id", skill_id).execute()
    return response.data[0] if response.data else None


async def update_user_skill(skill_id: str, update_data: dict) -> dict:
    """
    Update an existing skill
    Returns: Updated skill data
    """
    response = supabase.table("user_skills").update(update_data).eq("id", skill_id).execute()
    return response.data[0] if response.data else None


async def delete_user_skill(skill_id: str) -> bool:
    """
    Delete a skill from user profile
    Returns: True if successful
    """
    response = supabase.table("user_skills").delete().eq("id", skill_id).execute()
    return len(response.data) > 0 if response.data else False


async def calculate_profile_completeness(user_id: str) -> int:
    """
    Calculate profile completion score (0-100)
    Based on: bio, phone, location, skills count
    """
    user = await get_user_by_id(user_id)
    skills = await get_user_skills(user_id)
    
    score = 20  # Base score for having an account
    
    if user.get("bio"):
        score += 20
    if user.get("phone"):
        score += 15
    if user.get("latitude") and user.get("longitude"):
        score += 20
    if len(skills) > 0:
        score += 15
    if len(skills) >= 3:
        score += 10  # Bonus for multiple skills
    
    return min(score, 100)


async def update_profile_completeness(user_id: str) -> int:
    """
    Recalculate and update user's profile completeness
    Returns: New completeness score
    """
    score = await calculate_profile_completeness(user_id)
    supabase.table("users").update({"profile_completeness": score}).eq("id", user_id).execute()
    return score


# === ADMIN FUNCTIONS ===

async def get_admin_by_email(email: str) -> Optional[dict]:
    """
    Fetch admin by email
    Returns: Admin data or None
    """
    response = supabase.table("admins").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None


async def get_admin_by_id(admin_id: str) -> Optional[dict]:
    """
    Fetch admin by ID
    Returns: Admin data or None
    """
    response = supabase.table("admins").select("*").eq("id", admin_id).execute()
    return response.data[0] if response.data else None


async def create_admin_in_db(admin_data: dict) -> dict:
    """
    Create a new admin account
    Returns: Created admin data
    """
    response = supabase.table("admins").insert(admin_data).execute()
    return response.data[0] if response.data else None


async def update_admin_last_login(admin_id: str):
    """
    Update admin's last login timestamp
    """
    supabase.table("admins").update({"last_login": datetime.utcnow().isoformat()}).eq("id", admin_id).execute()


async def get_all_admins() -> list:
    """
    Get all admin accounts
    Returns: List of admins
    """
    response = supabase.table("admins").select("*").order("created_at", desc=True).execute()
    return response.data if response.data else []


async def update_admin_in_db(admin_id: str, update_data: dict) -> dict:
    """
    Update admin account
    Returns: Updated admin data
    """
    response = supabase.table("admins").update(update_data).eq("id", admin_id).execute()
    return response.data[0] if response.data else None


async def delete_admin_from_db(admin_id: str) -> bool:
    """
    Delete admin account
    Returns: True if successful
    """
    response = supabase.table("admins").delete().eq("id", admin_id).execute()
    return len(response.data) > 0 if response.data else False


async def get_admin_activity_logs(limit: int = 50) -> list:
    """
    Get recent admin activity logs
    Returns: List of activity logs
    """
    response = supabase.table("admin_activity_log").select("*").order("created_at", desc=True).limit(limit).execute()
    return response.data if response.data else []