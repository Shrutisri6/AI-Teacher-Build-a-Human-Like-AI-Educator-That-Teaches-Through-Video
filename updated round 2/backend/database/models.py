from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    level = Column(String)  # Beginner / Intermediate / Advanced
    language = Column(String)
    objective = Column(String)
    teaching_style = Column(String)
    available_time = Column(Integer)  # in minutes
    
    progress = relationship("ConceptProgress", back_populates="student")
    history = relationship("LessonHistory", back_populates="student")

class ConceptProgress(Base):
    __tablename__ = "concept_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    concept_name = Column(String, index=True)
    understanding_score = Column(Float, default=0.0) # 0.0 to 100.0
    
    student = relationship("Student", back_populates="progress")

class LessonHistory(Base):
    __tablename__ = "lesson_history"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    topic = Column(String)
    score = Column(Float, nullable=True)
    report = Column(JSON, nullable=True)
    
    student = relationship("Student", back_populates="history")
