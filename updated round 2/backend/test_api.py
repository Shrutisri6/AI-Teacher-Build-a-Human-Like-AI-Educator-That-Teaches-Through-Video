import sys
import os
sys.path.append(os.path.dirname(__file__))

try:
    from fastapi.testclient import TestClient
    from main import app
    from database.database import Base, engine
    
    # ensure tables are created
    Base.metadata.create_all(bind=engine)

    client = TestClient(app)
    response = client.post("/api/chat/interaction", json={
        "student_id": 1,
        "concept": "Physics",
        "action": "explain"
    })
    
    print("STATUS:", response.status_code)
    print("BODY:", response.json())
except ImportError as e:
    print(f"ImportError: {e}. Unable to run test script locally.")
except Exception as e:
    print(f"Error: {e}")
