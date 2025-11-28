"""
User data models with Pydantic validation
Ensures all user data is clean and valid before processing
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserRegistration(BaseModel):
    """
    Data required for user registration
    """
    email: EmailStr  # Auto-validates email format
    password: str = Field(min_length=8, max_length=72)  # bcrypt limit is 72 bytes
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securePass123",
                "full_name": "John Doe",
                "phone": "+1234567890"
            }
        }


class UserLogin(BaseModel):
    """
    Data required for user login
    """
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securePass123"
            }
        }


class UserResponse(BaseModel):
    """
    User data returned to client (NO password!)
    """
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    created_at: datetime
    is_active: bool = True
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """
    JWT token response
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Data stored inside JWT token
    """
    user_id: str
    email: str