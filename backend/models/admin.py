"""
Admin data models with strict validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime


class AdminLogin(BaseModel):
    """
    Admin login credentials
    """
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@skillconnector.com",
                "password": "Admin@123"
            }
        }


class AdminCreate(BaseModel):
    """
    Create new admin account
    """
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=72)
    role: Literal['admin', 'super_admin'] = 'admin'
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newadmin@skillconnector.com",
                "full_name": "John Admin",
                "password": "SecurePass123",
                "role": "admin"
            }
        }


class AdminResponse(BaseModel):
    """
    Admin data returned to client (NO password!)
    """
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminUpdate(BaseModel):
    """
    Update admin account
    """
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[Literal['admin', 'super_admin']] = None
    is_active: Optional[bool] = None


class AdminToken(BaseModel):
    """
    Admin JWT token response
    """
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse


class UserCreateByAdmin(BaseModel):
    """
    Admin creating a new user account
    """
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    is_active: bool = True


class ActivityLogResponse(BaseModel):
    """
    Admin activity log entry
    """
    id: str
    admin_id: str
    action: str
    target_type: str
    target_id: Optional[str] = None
    details: Optional[dict] = None
    created_at: datetime
    
    class Config:
        from_attributes = True