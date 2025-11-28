"""
Skill-related data models
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class SkillCategoryResponse(BaseModel):
    """
    Skill category data
    """
    id: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserSkillCreate(BaseModel):
    """
    Data for adding a new skill to user profile
    """
    category_id: str
    skill_name: str = Field(min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    experience_years: int = Field(default=0, ge=0, le=50)
    hourly_rate: Optional[Decimal] = Field(None, ge=0, le=10000)
    currency: str = Field(default="USD", max_length=3)
    is_available: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "category_id": "uuid-here",
                "skill_name": "Residential Plumbing",
                "description": "Expert in home plumbing repairs and installations",
                "experience_years": 5,
                "hourly_rate": 50.00,
                "currency": "USD",
                "is_available": True
            }
        }


class UserSkillResponse(BaseModel):
    """
    User skill data returned to client
    """
    id: str
    user_id: str
    category_id: str
    skill_name: str
    description: Optional[str] = None
    experience_years: int
    hourly_rate: Optional[Decimal] = None
    currency: str
    is_available: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserSkillUpdate(BaseModel):
    """
    Data for updating an existing skill
    """
    skill_name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    hourly_rate: Optional[Decimal] = Field(None, ge=0, le=10000)
    currency: Optional[str] = Field(None, max_length=3)
    is_available: Optional[bool] = None