"""
Authentication API Endpoints
Now connected to REAL Supabase database!
"""

from fastapi import APIRouter, HTTPException, status
from datetime import timedelta

from models.user import UserRegistration, UserLogin, Token, UserResponse
from core.security import hash_password, verify_password, create_access_token
from core.config import settings
from core.database import create_user_in_db, get_user_by_email, get_all_users

# Create router
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegistration):
    """
    Register a new user in the REAL database
    
    - Validates email format
    - Checks password length (min 8 chars)
    - Hashes password before storage
    - Saves to Supabase PostgreSQL
    - Returns user data (no password)
    """
    # Check if email already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Prepare user data for database
    new_user_data = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "hashed_password": hashed_password,
        "is_active": True
    }
    
    # Save to database
    created_user = await create_user_in_db(new_user_data)
    
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Return user data (no password!)
    return UserResponse(**created_user)


@router.post("/login", response_model=Token)
async def login_user(credentials: UserLogin):
    """
    User login - returns JWT access token
    
    - Validates email and password against database
    - Returns token for authenticated requests
    - Token expires in 30 minutes (configurable)
    """
    # Find user in database
    user = await get_user_by_email(credentials.email)
    
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user["id"], "email": user["email"]},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token)


@router.get("/users/count")
async def get_user_count():
    """
    Debug endpoint - shows users from REAL database
    (Will remove in production)
    """
    users = await get_all_users()
    return {
        "total_users": len(users),
        "users": users,
        "database": "Supabase PostgreSQL (LIVE)"
    }