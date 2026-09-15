from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    message: str
    token: str
    user: UserResponse

# Task Schemas
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    date_time: Optional[datetime] = Field(default_factory=datetime.utcnow)
    deadline: Optional[datetime] = None
    priority: str = Field(default="medium") # low, medium, high, urgent
    category: str = Field(default="General")
    tags: List[str] = Field(default_factory=list)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date_time: Optional[datetime] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: str # Return as string for React Native key compatibility
    _id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    dateTime: datetime
    deadline: Optional[datetime] = None
    priority: str
    category: str
    tags: List[str] = []
    isCompleted: bool
    completedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime
    mixScore: Optional[int] = 0

    class Config:
        from_attributes = True

class TaskStatsResponse(BaseModel):
    total: int
    completed: int
    pending: int
    urgent: int
    completionRate: int
