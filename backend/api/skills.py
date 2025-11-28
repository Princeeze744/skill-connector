"""
Skills API Endpoints
Manage skill categories and user skills
"""

from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional

from models.skill import (
    SkillCategoryResponse,
    UserSkillCreate,
    UserSkillResponse,
    UserSkillUpdate
)
from core.database import (
    get_all_skill_categories,
    get_skill_category_by_id,
    create_user_skill,
    get_user_skills,
    get_skill_by_id,
    update_user_skill,
    delete_user_skill,
    update_profile_completeness
)
from core.security import decode_access_token

router = APIRouter(prefix="/skills", tags=["Skills"])


# === HELPER FUNCTION ===
def get_user_from_token(authorization: Optional[str]) -> str:
    """
    Extract user_id from JWT token
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    return payload.get("user_id")


# === SKILL CATEGORIES ===

@router.get("/categories", response_model=List[SkillCategoryResponse])
async def list_skill_categories():
    """
    Get all available skill categories
    Public endpoint - no authentication required
    """
    categories = await get_all_skill_categories()
    return categories


@router.get("/categories/{category_id}", response_model=SkillCategoryResponse)
async def get_category(category_id: str):
    """
    Get details of a specific skill category
    """
    category = await get_skill_category_by_id(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )
    
    return category


# === USER SKILLS ===

@router.post("/", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
async def add_skill(
    skill_data: UserSkillCreate,
    authorization: Optional[str] = Header(None)
):
    """
    Add a new skill to user's profile
    Requires authentication
    """
    user_id = get_user_from_token(authorization)
    
    # Verify category exists
    category = await get_skill_category_by_id(skill_data.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )
    
    # Prepare skill data
    new_skill_data = {
        "user_id": user_id,
        "category_id": skill_data.category_id,
        "skill_name": skill_data.skill_name,
        "description": skill_data.description,
        "experience_years": skill_data.experience_years,
        "hourly_rate": float(skill_data.hourly_rate) if skill_data.hourly_rate else None,
        "currency": skill_data.currency,
        "is_available": skill_data.is_available
    }
    
    # Create skill
    created_skill = await create_user_skill(new_skill_data)
    
    if not created_skill:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create skill"
        )
    
    # Update profile completeness
    await update_profile_completeness(user_id)
    
    return created_skill


@router.get("/my-skills", response_model=List[UserSkillResponse])
async def get_my_skills(authorization: Optional[str] = Header(None)):
    """
    Get all skills for the authenticated user
    """
    user_id = get_user_from_token(authorization)
    skills = await get_user_skills(user_id)
    return skills


@router.get("/user/{user_id}", response_model=List[UserSkillResponse])
async def get_user_skills_public(user_id: str):
    """
    Get skills for any user (public endpoint)
    Used for viewing other users' profiles
    """
    skills = await get_user_skills(user_id)
    return skills


@router.put("/{skill_id}", response_model=UserSkillResponse)
async def update_skill(
    skill_id: str,
    skill_data: UserSkillUpdate,
    authorization: Optional[str] = Header(None)
):
    """
    Update an existing skill
    User can only update their own skills
    """
    user_id = get_user_from_token(authorization)
    
    # Get skill and verify ownership
    skill = await get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    if skill["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own skills"
        )
    
    # Prepare update data (only include provided fields)
    update_data = {}
    if skill_data.skill_name is not None:
        update_data["skill_name"] = skill_data.skill_name
    if skill_data.description is not None:
        update_data["description"] = skill_data.description
    if skill_data.experience_years is not None:
        update_data["experience_years"] = skill_data.experience_years
    if skill_data.hourly_rate is not None:
        update_data["hourly_rate"] = float(skill_data.hourly_rate)
    if skill_data.currency is not None:
        update_data["currency"] = skill_data.currency
    if skill_data.is_available is not None:
        update_data["is_available"] = skill_data.is_available
    
    # Update skill
    updated_skill = await update_user_skill(skill_id, update_data)
    
    if not updated_skill:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update skill"
        )
    
    return updated_skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_skill(
    skill_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Delete a skill from user's profile
    User can only delete their own skills
    """
    user_id = get_user_from_token(authorization)
    
    # Get skill and verify ownership
    skill = await get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    if skill["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own skills"
        )
    
    # Delete skill
    success = await delete_user_skill(skill_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete skill"
        )
    
    # Update profile completeness
    await update_profile_completeness(user_id)
    
    return None