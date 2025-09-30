
# AI Resume Reader Chatbot

Thank you for taking the time to review my submission. I am grateful for the opportunity to present this project, which demonstrates my ability to integrate OCR, OpenAI APIs, and a responsive web frontend to build a practical AI-driven application.

---

## 📌 Objective

The AI Resume Reader Chatbot is a web-based application that allows users to upload resumes (PDF or image) and automatically extract key information. The extracted data is displayed in a clean and organized table format within a chatbot interface.

The system performs the following:

1. Extract resume content using OCR (Optical Character Recognition).  
2. Process the extracted text using OpenAI GPT-4 / GPT-3.5 Turbo to identify key information.  
3. Display the extracted factors in a user-friendly table inside the chatbot interface.

---

## 📝 Resume Data Extracted

The application extracts the following fields:

| Field                  | Description                              |
|------------------------|------------------------------------------|
| Name                   | Candidate’s full name                     |
| Email                  | Primary email address                     |
| Phone Number           | Contact number                            |
| Skills                 | List of technical & soft skills          |
| Years of Experience    | Total professional experience            |
| Education              | Degree(s), major(s), institutions        |
| Current/Last Job       | Latest job position                       |
| Companies Worked At    | List of past employers                    |
| LinkedIn (Optional)    | LinkedIn profile                          |
| Certifications (Optional) | Professional certifications           |
| Location (Optional)    | Candidate location                        |

---

## 🛠 Technical Stack

### Frontend (React)
- Chatbot UI with chat bubbles for user and AI messages.  
- File upload functionality: PDF, PNG, JPG.  
- Display extracted data in a structured table inside bot messages.  
- Axios / Fetch to call backend APIs.

### Backend (Python - FastAPI)
- OCR Engine:
  - `pytesseract` for images  
  - `pdfplumber` or `PyMuPDF` for PDFs  
- OpenAI Integration:
  - GPT-4 or GPT-3.5 Turbo for resume parsing  
  - Returns structured JSON data  
- API endpoint: `/upload_resume/` for file upload and processing.

---

## ⚡ Functional Features

- Upload resumes in PDF, PNG, JPG, or JPEG format.  
- OCR extracts the text from the uploaded file.  
- Extracted text is sent to OpenAI for parsing.  
- Structured JSON response is returned and displayed as a table in the chatbot.  
- User messages appear on the **right**, AI responses on the **left** (classic chat layout).  

---

## 📂 Supported File Types

- PDF (`.pdf`)  
- Images (`.png`, `.jpg`, `.jpeg`)  

---

## 🖼 Project Screenshots

### 1. Upload Resume Screen
![Upload Resume](./images/upload_resume.png)

### 2. Processing Chat Bubble
![Processing](./images/processing.png)

### 3. Extracted Resume Data Table
![Resume Data Table](./images/resume_table.png)

> Note: Replace the above image paths with your actual screenshots in the `images` folder.

---

## ✅ Evaluation Criteria

- Accurate OCR text extraction from PDFs and images.  
- Clean and structured JSON response from OpenAI.  
- User-friendly frontend interface with chat bubbles and table rendering.  
- Well-designed backend API with proper error handling.  
- Clear, modular, and readable code structure.  

---

## 🙏 Thank You

I sincerely appreciate your time and consideration in reviewing my assignment. This project allowed me to demonstrate integration of AI, OCR, and modern frontend/backend technologies in a single application.  

I hope you enjoy exploring the AI Resume Reader Chatbot!  

---

## 📌 How to Run

1. Clone the repository:
```bash
git clone <repo-url>
````

2. **Backend**:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Linux/macOS
# OR for Windows PowerShell
# venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

3. **Frontend**:

```bash
cd frontend
npm install
npm start
```

4. Open your browser at `http://localhost:3000/` and start uploading resumes.

```

```
