from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import User, Task
from app.security import get_password_hash

def seed_database():
    print("[*] Initializing MySQL Database Tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing data
        db.query(Task).delete()
        db.query(User).delete()
        db.commit()

        print("[*] Creating default test user (rupesh@example.com / password123)...")
        hashed_pwd = get_password_hash("password123")
        test_user = User(
            name="Rupesh",
            email="rupesh@example.com",
            password=hashed_pwd
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        now = datetime.utcnow()
        in_2_hours = now + timedelta(hours=2)
        in_12_hours = now + timedelta(hours=12)
        in_2_days = now + timedelta(days=2)

        print("[*] Populating sample tasks with priorities and deadlines...")
        sample_tasks = [
            Task(
                user_id=test_user.id,
                title="Complete React Native Mobile Assignment",
                description="Build React Native CLI app, FastAPI backend, MySQL database, and Smart Mix Algorithm sorting.",
                date_time=now,
                deadline=in_2_hours,
                priority="urgent",
                category="Study",
                parsed_tags=["React Native", "FastAPI", "MySQL"],
                is_completed=False
            ),
            Task(
                user_id=test_user.id,
                title="Submit Project Repository & Documentation",
                description="Include clean architecture, API routes, and setup instructions.",
                date_time=now,
                deadline=in_12_hours,
                priority="high",
                category="Work",
                parsed_tags=["Git", "FastAPI"],
                is_completed=False
            ),
            Task(
                user_id=test_user.id,
                title="Morning Gym & Fitness Training",
                description="Cardio + strength workout session.",
                date_time=now,
                deadline=in_2_days,
                priority="medium",
                category="Fitness",
                parsed_tags=["Health"],
                is_completed=False
            ),
            Task(
                user_id=test_user.id,
                title="Grocery & Household Supplies",
                description="Buy fresh fruits, milk, and protein bars.",
                date_time=now,
                priority="low",
                category="Shopping",
                parsed_tags=["Home"],
                is_completed=True,
                completed_at=now
            )
        ]

        db.add_all(sample_tasks)
        db.commit()

        print("[SUCCESS] MySQL Database successfully seeded with 1 test user and 4 sample tasks!")
    except Exception as e:
        print("[ERROR] Seeding failed:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
