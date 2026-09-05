from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Student, ConceptProgress
from services import llm_service, avatar_service, speech_service, rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    student_id: int
    concept: str
    action: str # "explain" or "evaluate"
    student_answer: str = None
    question: str = None
    context: str = ""

@router.post("/interaction")
async def chat_interaction(request: ChatRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == request.student_id).first()
    
    if not student:
        student = Student(id=request.student_id, name="Test User", language="en")
        db.add(student)
        db.commit()
        db.refresh(student)
    
    # Retrieve context
    rag_context = ""
    try:
        search_query = request.concept
        if request.context:
            search_query += " " + request.context
        rag_context = await rag_service.retrieve_context(search_query, n_results=3)
    except Exception as e:
        print(f"Error retrieving context for chat: {e}")

    if request.action == "explain":
        explanation_text = await llm_service.generate_explanation(request.concept, rag_context)
        # Generate avatar video and speech
        avatar_video_url = await avatar_service.generate_avatar_video(explanation_text)
        speech_audio = await speech_service.generate_speech(explanation_text, student.language)
        
        return {
            "text": explanation_text,
            "avatar_video": avatar_video_url,
            "speech_audio": speech_audio,
            "type": "explanation"
        }
        
    elif request.action == "evaluate":
        evaluation = await llm_service.evaluate_answer(
            request.question, request.student_answer, request.concept
        )
        
        # Update progress
        progress = db.query(ConceptProgress).filter(
            ConceptProgress.student_id == student.id,
            ConceptProgress.concept_name == request.concept
        ).first()
        
        if not progress:
            progress = ConceptProgress(
                student_id=student.id,
                concept_name=request.concept,
                understanding_score=evaluation.get("understanding_score", 0.0) * 100
            )
            db.add(progress)
        else:
            # Simple moving average or adaptive scoring can be implemented here
            progress.understanding_score = (progress.understanding_score + (evaluation.get("understanding_score", 0.0) * 100)) / 2
        
        db.commit()
        
        feedback_text = evaluation.get("explanation", "Good job!")
        avatar_video_url = await avatar_service.generate_avatar_video(feedback_text)
        speech_audio = await speech_service.generate_speech(feedback_text, student.language)

        return {
            "is_correct": evaluation.get("is_correct"),
            "feedback": feedback_text,
            "avatar_video": avatar_video_url,
            "speech_audio": speech_audio,
            "new_score": progress.understanding_score,
            "type": "evaluation"
        }
        
    return {"error": "Invalid action"}
