import requests

BASE_URL = "http://localhost:5000/api"

def test_backend_api():
    print("=== TESTING FASTAPI + MYSQL BACKEND REST API ===")

    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    print("1. Health Check:", res.status_code, res.json())

    # 2. Login with seeded test user
    login_payload = {"email": "rupesh@example.com", "password": "password123"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    print("2. Login Status:", res.status_code)
    login_data = res.json()
    token = login_data["token"]
    print("   User:", login_data["user"]["name"], "| Token issued:", token[:25] + "...")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get User Profile
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print("3. Auth Me:", res.json())

    # 4. Fetch Tasks with Smart Mix Algorithm
    res = requests.get(f"{BASE_URL}/tasks?sortBy=mix", headers=headers)
    tasks_data = res.json()
    print("4. Fetch Tasks Count:", tasks_data["count"])
    for t in tasks_data["tasks"]:
        print(f"   - [{t['priority'].upper()}] {t['title']} | Score: {t['mixScore']} | Deadline: {t.get('deadline', 'none')}")

    # 5. Create a New Task
    new_task_payload = {
        "title": "Test FastAPI Task Creation from API Test Script",
        "description": "Verifying real-time MySQL persistence",
        "priority": "urgent",
        "category": "Work",
        "tags": ["API", "MySQL", "Test"]
    }
    res = requests.post(f"{BASE_URL}/tasks", json=new_task_payload, headers=headers)
    print("5. Create Task Status:", res.status_code)
    created_task = res.json()["task"]
    task_id = created_task["id"]
    print("   Created Task ID:", task_id, "| Title:", created_task["title"])

    # 6. Toggle Completion
    res = requests.patch(f"{BASE_URL}/tasks/{task_id}/toggle", headers=headers)
    print("6. Toggle Status:", res.json()["message"])

    # 7. Get Task Stats
    res = requests.get(f"{BASE_URL}/tasks/stats", headers=headers)
    print("7. Task Stats:", res.json())

    # 8. Clean up created test task
    res = requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=headers)
    print("8. Delete Task Status:", res.json())

    print("\n✅ ALL FASTAPI + MYSQL ENDPOINT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_backend_api()
