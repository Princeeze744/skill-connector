"""
Configuration Management
Loads environment variables with Pydantic validation
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # App Info
    APP_NAME: str = "Global Skill Connector"
    DEBUG: bool = True
    API_VERSION: str = "0.3.0"
    
    # Security
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database (Phase 3)
    DATABASE_URL: Optional[str] = None
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Frontend (Phase 9)
    FRONTEND_URL: Optional[str] = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()