from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, UserResponse, AuthTokenResponse
from app.security import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    email_clean = user_in.email.lower()
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        name=user_in.name,
        email=email_clean,
        password=hashed_pwd,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(user_id=new_user.id)

    return AuthTokenResponse(
        message="Registration successful",
        token=token,
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=AuthTokenResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    email_clean = user_in.email.lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(user_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(user_id=user.id)

    return AuthTokenResponse(
        message="Login successful",
        token=token,
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    return {"user": UserResponse.model_validate(current_user)}
