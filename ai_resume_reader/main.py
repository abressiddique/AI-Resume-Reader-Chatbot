import os
import io
import pdfplumber
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI

# ----------------------
# Load environment variables
# ----------------------
load_dotenv()  # reads .env file

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ----------------------
# FastAPI app
# ----------------------
app = FastAPI(title="AI Resume Reader Chatbot")

# ----------------------
# CORS middleware
# ----------------------
origins = [
    "http://localhost:5173",  # Vite dev server URL
    "http://localhost:3000",  # React dev server URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Helper: Extract text
# ----------------------
def extract_text_from_pdf(file: UploadFile):
    text = ""
    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception:
        # Fallback: PyMuPDF if pdfplumber fails
        file.file.seek(0)
        pdf_doc = fitz.open(stream=file.file.read(), filetype="pdf")
        for page in pdf_doc:
            text += page.get_text()
    return text

def extract_text_from_image(file: UploadFile):
    image = Image.open(io.BytesIO(file.file.read()))
    text = pytesseract.image_to_string(image)
    return text

# ----------------------
# Helper: Parse resume with OpenAI
# ----------------------
def parse_resume_with_openai(resume_text: str):
    prompt = f"""
You are an AI assistant that extracts structured information from resumes.
Extract the following fields: 
- Name 
- Email 
- Phone Number 
- Skills 
- Years of Experience 
- Education 
- Current/Last Job 
- Companies Worked At 
- LinkedIn (if present) 
- Certifications (if present) 
- Location (if present)

Return ONLY valid JSON in this format:
{{
  "Name": "...",
  "Email": "...",
  "Phone Number": "...",
  "Skills": ["..."],
  "Years of Experience": "...",
  "Education": ["..."],
  "Current/Last Job": "...",
  "Companies Worked At": ["..."],
  "LinkedIn": "...",
  "Certifications": ["..."],
  "Location": "..."
}}

Resume Text:
{resume_text}
"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content

# ----------------------
# API endpoint
# ----------------------
@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Extract text
    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file)
    else:
        text = extract_text_from_image(file)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    # Parse with OpenAI
    try:
        parsed_data = parse_resume_with_openai(text)
        return JSONResponse(content={"resume_data": parsed_data})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
