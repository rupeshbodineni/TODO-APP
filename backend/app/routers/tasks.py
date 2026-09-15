from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models import User, Task
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskStatsResponse
from app.security import get_current_user
from app.mix_sorter import sort_tasks_by_mix, calculate_task_mix_score

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

def format_task_response(task: Task) -> dict:
    return {
        "id": str(task.id),
        "_id": str(task.id),
        "title": task.title,
        "description": task.description or "",
        "dateTime": task.date_time,
        "deadline": task.deadline,
        "priority": task.priority,
        "category": task.category,
        "tags": task.parsed_tags,
        "isCompleted": task.is_completed,
        "completedAt": task.completed_at,
        "createdAt": task.created_at,
        "updatedAt": task.updated_at,
        "mixScore": calculate_task_mix_score(task),
    }

@router.get("", response_model=dict)
def get_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("mix", alias="sortBy"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Task).filter(Task.user_id == current_user.id)

    # Status filter
    if status_filter == "completed":
        query = query.filter(Task.is_completed == True)
    elif status_filter == "pending":
        query = query.filter(Task.is_completed == False)
    elif status_filter == "today":
        start_of_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = datetime.utcnow().replace(hour=23, minute=59, second=59, microsecond=999999)
        query = query.filter(Task.date_time >= start_of_day, Task.date_time <= end_of_day)

    # Category filter
    if category and category != "All":
        query = query.filter(Task.category == category)

    # Priority filter
    if priority and priority != "All":
        query = query.filter(Task.priority == priority.lower())

    # Search filter
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Task.title.ilike(term),
                Task.description.ilike(term),
                Task.tags.ilike(term),
                Task.category.ilike(term)
            )
        )

    tasks = query.all()

    # Apply Sorting
    if sort_by == "mix":
        tasks = sort_tasks_by_mix(tasks)
    elif sort_by == "deadline":
        tasks.sort(key=lambda t: t.deadline or datetime.max)
    elif sort_by == "priority":
        p_order = {"urgent": 4, "high": 3, "medium": 2, "low": 1}
        tasks.sort(key=lambda t: p_order.get(t.priority.lower(), 1), reverse=True)
    elif sort_by == "date":
        tasks.sort(key=lambda t: t.date_time, reverse=True)

    formatted = [format_task_response(t) for t in tasks]

    return {
        "count": len(formatted),
        "tasks": formatted
    }

@router.get("/stats", response_model=TaskStatsResponse)
def get_task_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Task).filter(Task.user_id == current_user.id).count()
    completed = db.query(Task).filter(Task.user_id == current_user.id, Task.is_completed == True).count()
    pending = db.query(Task).filter(Task.user_id == current_user.id, Task.is_completed == False).count()
    urgent = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.is_completed == False,
        Task.priority == "urgent"
    ).count()

    completion_rate = int((completed / total) * 100) if total > 0 else 0

    return TaskStatsResponse(
        total=total,
        completed=completed,
        pending=pending,
        urgent=urgent,
        completionRate=completion_rate
    )

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_task = Task(
        user_id=current_user.id,
        title=task_in.title.strip(),
        description=(task_in.description or "").strip(),
        date_time=task_in.date_time or datetime.utcnow(),
        deadline=task_in.deadline,
        priority=task_in.priority.lower(),
        category=task_in.category or "General",
        parsed_tags=task_in.tags or [],
        is_completed=False
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message": "Task created successfully",
        "task": format_task_response(new_task)
    }

@router.put("/{task_id}", response_model=dict)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")

    if task_in.title is not None:
        task.title = task_in.title.strip()
    if task_in.description is not None:
        task.description = task_in.description.strip()
    if task_in.date_time is not None:
        task.date_time = task_in.date_time
    if task_in.deadline is not None:
        task.deadline = task_in.deadline
    if task_in.priority is not None:
        task.priority = task_in.priority.lower()
    if task_in.category is not None:
        task.category = task_in.category
    if task_in.tags is not None:
        task.parsed_tags = task_in.tags
    if task_in.is_completed is not None:
        task.is_completed = task_in.is_completed
        task.completed_at = datetime.utcnow() if task_in.is_completed else None

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated successfully",
        "task": format_task_response(task)
    }

@router.patch("/{task_id}/toggle", response_model=dict)
def toggle_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")

    task.is_completed = not task.is_completed
    task.completed_at = datetime.utcnow() if task.is_completed else None

    db.commit()
    db.refresh(task)

    return {
        "message": f"Task marked as {'completed' if task.is_completed else 'pending'}",
        "task": format_task_response(task)
    }

@router.delete("/{task_id}", response_model=dict)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully", "id": str(task_id)}
