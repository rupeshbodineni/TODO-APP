from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, tasks

# Automatically create MySQL tables on application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI + MySQL REST API Backend for React Native To-Do App"
)

# Enable CORS for Mobile App and Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "backend": "FastAPI (Python)",
        "database": "MySQL",
        "message": "React Native To-Do API is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)
