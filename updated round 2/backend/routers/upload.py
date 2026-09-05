from fastapi import APIRouter, UploadFile, File
from services import rag_service

router = APIRouter()

@router.post("/document")
async def upload_document(file: UploadFile = File(...)):
    result = await rag_service.process_document(file)
    return {"status": "success", "message": result}
