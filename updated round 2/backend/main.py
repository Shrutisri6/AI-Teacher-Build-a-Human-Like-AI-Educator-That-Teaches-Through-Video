import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import engine, Base, get_db
from database import models
from routers import student, lesson, chat, upload

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduVision AI Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, update in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(lesson.router, prefix="/api/lesson", tags=["Lesson"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.get("/")
def read_root():
    return {"message": "Welcome to EduVision AI Backend"}
