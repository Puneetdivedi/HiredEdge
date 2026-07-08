# ⚡ HiredEdge

> AI-powered Resume ↔ Job Description Gap Analyzer

🔗 **Live Demo:** https://hired-edge.vercel.app

HiredEdge analyzes your resume against any job description and tells you **exactly** what's missing, rewrites your bullets to match, and gives you a personalized roadmap to land the role.

---

## ✨ Key Features

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

## 🚀 Free Deployment Guide (Live Demo)

Deploy HiredEdge for 100% free using Render (Backend) and Vercel (Frontend).

### 1. Backend (Render.com)

1. Create a free account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `HiredEdge` repository.
4. **Settings:**
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   - `OPENAI_API_KEY` = your_openai_key (or `GOOGLE_API_KEY`)
   - Leave Supabase variables empty if you don't need history for the demo.
6. Click **Deploy Web Service**. Once live, copy your `.onrender.com` URL.

> ⚠️ **Note on Render's Free Tier:** Render spins down free web services after 15 minutes of inactivity. When a recruiter opens your link for the first time, getting the first AI analysis might take up to 50 seconds while the backend "wakes up". After that, it will be lightning fast.

---

### 2. Frontend (Vercel.com)

1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `HiredEdge` repository.
4. **Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
5. **Environment Variables:**
   - `VITE_API_URL` = Paste your Render Backend URL here (e.g., `https://hiredge-backend.onrender.com`).
6. Click **Deploy**. Vercel will give you a live URL for your production-ready frontend.

---

## 🤝 Contributing

PRs welcome! Please open an issue first for major changes.

---

## 📄 License

MIT
