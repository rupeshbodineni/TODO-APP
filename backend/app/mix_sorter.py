from datetime import datetime, timezone
from app.models import Task

def calculate_task_mix_score(task: Task) -> int:
    """
    Calculates a multi-factor dynamic urgency score combining Priority, Deadline Urgency, and Scheduled Time.
    """
    if task.is_completed:
        return -10000

    now = datetime.utcnow()

    # 1. Priority Base Weight
    priority_weights = {
        "urgent": 1000,
        "high": 600,
        "medium": 300,
        "low": 100,
    }
    priority_score = priority_weights.get(task.priority.lower(), 300)

    # 2. Deadline Urgency Score
    deadline_score = 0
    if task.deadline:
        deadline_time = task.deadline
        hours_remaining = (deadline_time - now).total_seconds() / 3600.0

        if hours_remaining < 0:
            # Overdue
            hours_overdue = abs(hours_remaining)
            deadline_score = 2000 + int(min(hours_overdue * 50, 1000))
        elif hours_remaining <= 3:
            deadline_score = 1500
        elif hours_remaining <= 12:
            deadline_score = 1000
        elif hours_remaining <= 24:
            deadline_score = 600
        elif hours_remaining <= 72:
            deadline_score = 300
        else:
            deadline_score = max(0, int(100 - (hours_remaining / 24.0) * 10))

    # 3. Scheduled Time Factor
    time_score = 0
    if task.date_time:
        diff_hours = (now - task.date_time).total_seconds() / 3600.0
        if diff_hours >= 0:
            time_score = 200 + int(min(diff_hours * 10, 300))
        else:
            time_score = max(0, int(100 - abs(diff_hours) * 5))

    return priority_score + deadline_score + time_score

def sort_tasks_by_mix(tasks: list[Task]) -> list[Task]:
    return sorted(tasks, key=lambda t: calculate_task_mix_score(t), reverse=True)
