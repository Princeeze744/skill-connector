from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List
import os
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Skill Connector API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

class SkillCreate(BaseModel):
    skill_name: str
    category_name: str
    description: Optional[str] = None
    experience_years: int
    hourly_rate: float
    currency: str = "USD"
    is_available: bool = True

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None

class MessageCreate(BaseModel):
    receiver_id: str
    message: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    message: str
    created_at: str
    is_read: bool
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Routes
@app.get("/")
async def root():
    return {"message": "Skill Connector API", "status": "running"}

# Auth routes
@app.post("/auth/signup", response_model=Token)
async def signup(user: UserSignup):
    # Check if user exists
    existing_user = supabase.table('users').select('*').eq('email', user.email).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user.password)
    
    # Create user
    new_user = {
        "email": user.email,
        "password": hashed_password,
        "full_name": user.full_name,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table('users').insert(new_user).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    user_data = result.data[0]
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data['id']})
    
    # Remove password from response
    user_data.pop('password', None)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Get user from database
    db_user = supabase.table('users').select('*').eq('email', user.email).execute()
    
    if not db_user.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_data = db_user.data[0]
    
    # Verify password
    if not verify_password(user.password, user_data['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data['id']})
    
    # Remove password from response
    user_data.pop('password', None)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

# Public endpoint to list all users (professionals)
@app.get("/users/")
async def get_all_users():
    """Get all users for public browsing (professionals marketplace)"""
    try:
        result = supabase.table('users').select('*').execute()
        # Remove passwords from all users
        users = result.data
        for user in users:
            user.pop('password', None)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

# Public endpoint to get a single user by ID
@app.get("/users/{user_id}")
async def get_user_by_id(user_id: str):
    """Get a specific user's public profile"""
    try:
        result = supabase.table('users').select('*').eq('id', user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_data = result.data[0]
        # Remove password from response
        user_data.pop('password', None)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

# Profile routes
@app.get("/profile/me")
async def get_profile(authorization: str = Depends(lambda: None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = result.data[0]
    user_data.pop('password', None)
    
    return user_data

@app.put("/profile/me")
async def update_profile(profile: ProfileUpdate, authorization: str = Depends(lambda: None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    # Update only provided fields
    update_data = profile.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = supabase.table('users').update(update_data).eq('id', user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = result.data[0]
    user_data.pop('password', None)
    
    return user_data

@app.put("/profile/location")
async def update_location(location: LocationUpdate, authorization: str = Depends(lambda: None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    result = supabase.table('users').update({
        "latitude": location.latitude,
        "longitude": location.longitude
    }).eq('id', user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Location updated successfully"}

# Skills routes
@app.get("/skills/categories")
async def get_categories():
    """Get all skill categories"""
    result = supabase.table('skill_categories').select('*').execute()
    return result.data

@app.post("/skills/categories")
async def create_category(category: CategoryCreate):
    """Create a new skill category"""
    result = supabase.table('skill_categories').insert(category.dict()).execute()
    return result.data[0]

@app.post("/skills")
async def create_skill(skill: SkillCreate, authorization: str = Depends(lambda: None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    skill_data = skill.dict()
    skill_data['user_id'] = user_id
    skill_data['created_at'] = datetime.utcnow().isoformat()
    
    result = supabase.table('user_skills').insert(skill_data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create skill")
    
    return result.data[0]

@app.get("/skills/user/{user_id}")
async def get_user_skills(user_id: str):
    """Get all skills for a specific user"""
    result = supabase.table('user_skills').select('*').eq('user_id', user_id).execute()
    return result.data

@app.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str, authorization: str = Depends(lambda: None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    # Check if skill belongs to user
    skill = supabase.table('user_skills').select('*').eq('id', skill_id).execute()
    
    if not skill.data:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if skill.data[0]['user_id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this skill")
    
    supabase.table('user_skills').delete().eq('id', skill_id).execute()
    
    return {"message": "Skill deleted successfully"}

# Messaging routes
@app.post("/messages/send")
async def send_message(msg: MessageCreate, authorization: str = Depends(lambda: None)):
    """Send a message to another user"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    sender_id = get_current_user(token)
    
    # Create message
    message_data = {
        "sender_id": sender_id,
        "receiver_id": msg.receiver_id,
        "message": msg.message,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table('messages').insert(message_data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to send message")
    
    return result.data[0]

@app.get("/messages/conversations")
async def get_conversations(authorization: str = Depends(lambda: None)):
    """Get all conversations for the current user"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    # Get all messages where user is sender or receiver
    sent = supabase.table('messages').select('*').eq('sender_id', user_id).execute()
    received = supabase.table('messages').select('*').eq('receiver_id', user_id).execute()
    
    all_messages = sent.data + received.data
    
    # Group by conversation partner
    conversations = {}
    for msg in all_messages:
        partner_id = msg['receiver_id'] if msg['sender_id'] == user_id else msg['sender_id']
        
        if partner_id not in conversations:
            conversations[partner_id] = {
                'partner_id': partner_id,
                'messages': [],
                'last_message': None,
                'unread_count': 0
            }
        
        conversations[partner_id]['messages'].append(msg)
        
        # Count unread messages
        if msg['receiver_id'] == user_id and not msg['is_read']:
            conversations[partner_id]['unread_count'] += 1
    
    # Get partner details and find last message
    result = []
    for partner_id, conv in conversations.items():
        # Get partner name
        partner = supabase.table('users').select('full_name').eq('id', partner_id).execute()
        partner_name = partner.data[0]['full_name'] if partner.data else 'Unknown'
        
        # Sort messages by date
        conv['messages'].sort(key=lambda x: x['created_at'], reverse=True)
        last_msg = conv['messages'][0]
        
        result.append({
            'partner_id': partner_id,
            'partner_name': partner_name,
            'last_message': last_msg['message'],
            'last_message_time': last_msg['created_at'],
            'unread_count': conv['unread_count'],
            'is_sender': last_msg['sender_id'] == user_id
        })
    
    # Sort by most recent
    result.sort(key=lambda x: x['last_message_time'], reverse=True)
    
    return result

@app.get("/messages/conversation/{partner_id}")
async def get_conversation(partner_id: str, authorization: str = Depends(lambda: None)):
    """Get all messages with a specific user"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    user_id = get_current_user(token)
    
    # Get all messages between these two users
    sent = supabase.table('messages').select('*').eq('sender_id', user_id).eq('receiver_id', partner_id).execute()
    received = supabase.table('messages').select('*').eq('sender_id', partner_id).eq('receiver_id', user_id).execute()
    
    all_messages = sent.data + received.data
    all_messages.sort(key=lambda x: x['created_at'])
    
    # Mark received messages as read
    if received.data:
        for msg in received.data:
            if not msg['is_read']:
                supabase.table('messages').update({'is_read': True}).eq('id', msg['id']).execute()
    
    # Get partner details
    partner = supabase.table('users').select('full_name').eq('id', partner_id).execute()
    partner_name = partner.data[0]['full_name'] if partner.data else 'Unknown'
    
    return {
        'partner_id': partner_id,
        'partner_name': partner_name,
        'messages': all_messages
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)