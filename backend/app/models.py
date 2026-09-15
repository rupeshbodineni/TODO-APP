import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to tasks
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True, default="")
    date_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    deadline = Column(DateTime, nullable=True)
    priority = Column(String(20), default="medium", nullable=False) # low, medium, high, urgent
    category = Column(String(50), default="General", nullable=False)
    tags = Column(Text, default="[]") # Store tags as JSON string array
    is_completed = Column(Boolean, default=False, index=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="tasks")

    @property
    def parsed_tags(self):
        try:
            return json.loads(self.tags) if self.tags else []
        except Exception:
            return []

    @parsed_tags.setter
    def parsed_tags(self, value):
        self.tags = json.dumps(value if isinstance(value, list) else [])
