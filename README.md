# ⚡ HiredEdge

> AI-powered Resume ↔ Job Description Gap Analyzer

HiredEdge analyzes your resume against any job description and tells you **exactly** what's missing, rewrites your bullets to match, and gives you a personalized roadmap to land the role.

---

## ✨ Features

- 📄 **Resume Upload** — PDF parsing + text extraction
- 🔍 **Gap Analysis** — AI finds missing skills, keywords, and experience
- 📊 **Match Score** — Percentage match with breakdown by category
- ✍️ **Bullet Rewriter** — AI rewrites your resume bullets to align with the JD
- 🗺️ **Learning Roadmap** — Actionable next steps to fill your gaps
- 💾 **History** — Save and compare multiple JD analyses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | OpenAI GPT-4o |
| PDF Parsing | pdfplumber |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel + Railway |

---

## 📁 Project Structure

```
hiredge/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # FastAPI server
│   ├── main.py
│   ├── routers/
│   │   ├── analyze.py     # Core analysis endpoint
│   │   └── history.py     # Save/retrieve analyses
│   ├── services/
│   │   ├── pdf_parser.py  # Resume PDF extraction
│   │   ├── ai_analyzer.py # GPT-4o integration
│   │   └── scorer.py      # Match scoring logic
│   ├── utils/
│   │   └── prompts.py     # All AI prompts
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/hiredge.git
cd hiredge
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your API keys in .env

uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your config

npm run dev
```

### 4. Open `http://localhost:5173` 🎉

---

## 🔑 Environment Variables

### Backend `.env`
```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...
```

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze resume vs JD |
| GET | `/history` | Get past analyses |
| POST | `/history` | Save an analysis |
| DELETE | `/history/{id}` | Delete saved analysis |

---

## 🤝 Contributing

PRs welcome! Please open an issue first for major changes.

---

## 📄 License

MIT
