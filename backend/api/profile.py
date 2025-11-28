"""
User Profile API Endpoints
Manage user profile information
"""

from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from pydantic import BaseModel, Field

from models.user import UserResponse
from core.database import (
    get_user_by_id,
    update_profile_completeness
)
from core.security import decode_access_token

router = APIRouter(prefix="/profile", tags=["Profile"])


class ProfileUpdate(BaseModel):
    """
    Data for updating user profile
    """
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = Field(None, max_length=500)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    is_available: Optional[bool] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "phone": "+1234567890",
                "bio": "Experienced plumber with 10 years in residential and commercial work",
                "latitude": 6.4651,
                "longitude": 7.4876,
                "is_available": True
            }
        }


class ProfileResponse(BaseModel):
    """
    Complete profile data with completeness score
    """
    user: UserResponse
    profile_completeness: int
    total_skills: int


def get_user_from_token(authorization: Optional[str]) -> str:
    """Extract user_id from JWT token"""
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


@router.get("/me", response_model=UserResponse)
async def get_my_profile(authorization: Optional[str] = Header(None)):
    """
    Get authenticated user's profile
    """
    user_id = get_user_from_token(authorization)
    user = await get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(user_id: str):
    """
    Get any user's public profile
    """
    user = await get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    profile_data: ProfileUpdate,
    authorization: Optional[str] = Header(None)
):
    """
    Update authenticated user's profile
    """
    from core.database import supabase
    
    user_id = get_user_from_token(authorization)
    
    # Prepare update data (only include provided fields)
    update_data = {}
    if profile_data.full_name is not None:
        update_data["full_name"] = profile_data.full_name
    if profile_data.phone is not None:
        update_data["phone"] = profile_data.phone
    if profile_data.bio is not None:
        update_data["bio"] = profile_data.bio
    if profile_data.latitude is not None:
        update_data["latitude"] = profile_data.latitude
    if profile_data.longitude is not None:
        update_data["longitude"] = profile_data.longitude
    if profile_data.is_available is not None:
        update_data["is_available"] = profile_data.is_available
    
    # Update user
    response = supabase.table("users").update(update_data).eq("id", user_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
    
    # Recalculate profile completeness
    await update_profile_completeness(user_id)
    
    # Get updated user data
    updated_user = await get_user_by_id(user_id)
    
    return updated_user