from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Student

router = APIRouter()

class StudentCreate(BaseModel):
    name: str
    level: str
    language: str
    objective: str
    teaching_style: str
    available_time: int

@router.post("/profile")
def create_student_profile(profile: StudentCreate, db: Session = Depends(get_db)):
    new_student = Student(**profile.model_dump())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"status": "success", "student_id": new_student.id}

@router.get("/profile/{student_id}")
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    return student

@router.get("/dashboard/{student_id}")
def get_student_dashboard(student_id: int, db: Session = Depends(get_db)):
    from sqlalchemy.sql import func
    from database.models import ConceptProgress, LessonHistory
    
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
        
    # Get average score
    avg_score = db.query(func.avg(ConceptProgress.understanding_score)).filter(ConceptProgress.student_id == student_id).scalar()
    avg_score = round(avg_score, 1) if avg_score else 0.0
    
    # Get completed topics count
    completed_topics = db.query(LessonHistory).filter(LessonHistory.student_id == student_id).count()
    
    # Get strong concepts (score >= 80)
    strong = db.query(ConceptProgress.concept_name).filter(
        ConceptProgress.student_id == student_id,
        ConceptProgress.understanding_score >= 80
    ).order_by(ConceptProgress.understanding_score.desc()).limit(3).all()
    
    # Get weak concepts (score < 60)
    weak = db.query(ConceptProgress.concept_name).filter(
        ConceptProgress.student_id == student_id,
        ConceptProgress.understanding_score < 60
    ).order_by(ConceptProgress.understanding_score.asc()).limit(3).all()
    
    return {
        "stats": {
            "score": avg_score,
            "completed": completed_topics,
            "timeSpent": f"{student.available_time or 0}m/day" # simplified
        },
        "strongConcepts": [c[0] for c in strong],
        "weakConcepts": [c[0] for c in weak]
    }
