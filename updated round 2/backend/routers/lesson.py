from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Student
from services import llm_service, rag_service

router = APIRouter()

class TopicRequest(BaseModel):
    topic: str
    student_id: int

@router.post("/generate")
async def generate_lesson(request: TopicRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == request.student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # Fetch context using RAG
    context = ""
    try:
        context = await rag_service.retrieve_context(request.topic, n_results=5)
    except Exception as e:
        print(f"Error retrieving context: {e}")

    # Generate Lesson Plan using LLM Service
    lesson_plan = await llm_service.generate_lesson_plan(
        topic=request.topic,
        level=student.level,
        language=student.language,
        time_minutes=student.available_time,
        context=context
    )
    
    return {"status": "success", "lesson_plan": lesson_plan}
