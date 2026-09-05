import os
from openai import AsyncOpenAI
import json

# Initialize client pointing to Gemini via OpenAI compatibility layer
client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY", "mock-key"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

MODEL_NAME = "gemini-3.6-flash"

async def generate_lesson_plan(topic: str, level: str, language: str, time_minutes: int, context: str = "") -> dict:
    prompt = f"""
    Create a lesson plan for the topic: {topic}.
    Target audience level: {level}
    Language: {language}
    Available time: {time_minutes} minutes.
    """
    
    if context and "No relevant context found" not in context and "mock context" not in context:
        prompt += f"\nUse the following provided content to design the lesson:\n{context}\n"
        
    prompt += """
    Output JSON format with:
    - title
    - objectives (list)
    - sections (list of dicts with 'title', 'duration', 'content_type')
    """
    
    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an expert AI teacher planning a lesson. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"LLM Error: {e}")
        # Mock response for demo/development if API fails or key is invalid
        return {
            "title": f"Introduction to {topic}",
            "objectives": ["Understand basics", "Apply concepts"],
            "sections": [
                {"title": "Introduction", "duration": time_minutes // 4, "content_type": "concept"},
                {"title": "Deep Dive", "duration": time_minutes // 2, "content_type": "explanation"},
                {"title": "Assessment", "duration": time_minutes // 4, "content_type": "quiz"}
            ]
        }

async def generate_explanation(concept: str, context: str = "") -> str:
    prompt = f"Explain the concept of '{concept}'. Context: {context}"
    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a human-like AI teacher explaining concepts clearly and concisely."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
         return f"[Mock Explanation for {concept}] This is a detailed explanation of {concept} generated because the LLM API is unavailable."

async def evaluate_answer(question: str, student_answer: str, correct_concept: str) -> dict:
    prompt = f"""
    Question: {question}
    Student Answer: {student_answer}
    Correct Concept: {correct_concept}
    
    Evaluate the student's answer. Return JSON with:
    - is_correct (boolean)
    - explanation (string explaining why it is correct or incorrect, gently correcting if wrong)
    - understanding_score (0.0 to 1.0)
    """
    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a supportive AI teacher evaluating answers. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
         return {
             "is_correct": False,
             "explanation": "Let's review this again. [Mock feedback due to API failure]",
             "understanding_score": 0.5
         }
