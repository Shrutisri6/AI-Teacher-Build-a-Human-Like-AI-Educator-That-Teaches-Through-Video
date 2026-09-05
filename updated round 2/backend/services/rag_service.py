import os
import chromadb
from fastapi import UploadFile
import fitz  # PyMuPDF
from openai import AsyncOpenAI

# Initialize ChromaDB client locally
chroma_client = chromadb.Client()
# Use a specific embedding model configuration if needed, otherwise chroma defaults to all-MiniLM-L6-v2
# But we will explicitly pass OpenAI embeddings for large documents.
collection = chroma_client.get_or_create_collection(name="eduvision_documents")

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY", "mock-key"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def chunk_text(text: str, chunk_size: int = 1500, overlap: int = 200) -> list[str]:
    """Splits large text into smaller chunks with overlap for better context retention."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

async def process_document(file: UploadFile) -> str:
    """
    Process the uploaded large document, extract text, chunk it, and store embeddings.
    """
    print(f"Processing large file: {file.filename}")
    
    # 1. Extract Text
    content = await file.read()
    text = ""
    
    if file.filename.endswith(".pdf"):
        # Use PyMuPDF for fast PDF extraction
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text()
    else:
        # Fallback for TXT
        text = content.decode("utf-8", errors="ignore")
        
    if not text.strip():
        return "Error: No text could be extracted from the document."

    # 2. Chunking for Large Documents
    # We use a larger chunk size to preserve context, with overlap.
    chunks = chunk_text(text)
    
    # 3. Generate Embeddings (using OpenAI text-embedding-3-small, ideal for large docs)
    # Note: In a real scenario with very large docs, you'd batch these requests.
    try:
        response = await client.embeddings.create(
            input=chunks,
            model="text-embedding-3-small"
        )
        embeddings = [data.embedding for data in response.data]
        
        # 4. Store in ChromaDB
        ids = [f"{file.filename}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"source": file.filename, "chunk_index": i} for i in range(len(chunks))]
        
        collection.upsert(
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        return f"Successfully processed '{file.filename}'. Extracted {len(chunks)} chunks into the knowledge base."
        
    except Exception as e:
        print(f"Embedding error: {e}")
        return f"Failed to generate embeddings. (Check API Key). Extracted {len(chunks)} chunks, but could not store them."

async def retrieve_context(query: str, n_results: int = 3) -> str:
    """
    Query the vector database for relevant context based on the query.
    """
    try:
        # Generate embedding for the query
        response = await client.embeddings.create(
            input=query,
            model="text-embedding-3-small"
        )
        query_embedding = response.data[0].embedding
        
        # Search ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        if results['documents'] and len(results['documents'][0]) > 0:
            context = "\n\n---\n\n".join(results['documents'][0])
            return context
            
        return "No relevant context found in documents."
    except Exception as e:
        print(f"Retrieval error: {e}")
        return "This is mock context retrieved because the embedding API failed or is missing."
