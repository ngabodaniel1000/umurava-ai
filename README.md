# Umurava AI - AI-Powered Talent Screening Platform

Umurava AI is a cutting-edge recruitment platform designed to streamline the candidate evaluation process using Google Gemini's advanced generative AI models. It automates the screening of resumes against specific job requirements, providing recruiters with an explainable, ranked shortlist of the best talent.

## 🏗️ Architecture

The application follows a modern full-stack architecture built on the MERN stack with complete TypeScript integration.

```mermaid
graph TD
    Client[Next.js Frontend] <--> Backend[Express.js Server]
    Backend <--> DB[(MongoDB)]
    Backend <--> AI[Google Gemini API]
    
    subgraph "Backend Structure"
        Routes[Routes]
        Controllers[Controllers]
        Models[Models]
        Middleware[Auth Middleware]
    end
    
    subgraph "AI Decision Engine"
        Prompt[Prompt Engineering]
        Fallback[Model Fallback Logic]
        Parser[JSON Result Parser]
    end
```

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express.js (TypeScript)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with HTTP-only Cookies
- **AI**: Google Generative AI (Gemini API)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or local)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone <repository-url>
cd umurava-ai
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file (see Environment Variables section)
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
# Ensure backend is running at http://localhost:4000
npm run dev
```

## 🔑 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key` |
| `GEMINI_API_KEY` | Google AI API Key | `AIzaSy...` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend (`client/.env.local`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000/api` |

## 🤖 AI Decision Flow

The platform uses a sophisticated AI screening engine to evaluate candidates:

1.  **Data Consolidation**: Fetches the complete job description and all candidate talent profiles associated with the job.
2.  **Context Construction**: Orchestrates a rich, structured prompt that instructs the AI on specific evaluation criteria (Skills 25%, Experience 30%, Education 20%, Projects 15%, Availability 10%).
3.  **Resilient Execution**: Uses a **Model Fallback Logic** to ensure high availability:
    *   Attempts `gemini-2.5-flash` for high-speed analysis.
    *   Falls back to `gemini-2.0-flash-exp` if prioritized models are unavailable.
    *   Continues through `gemini-1.5-flash`, `1.5-pro`, and `1.0-pro` until success.
4.  **Structured Analysis**: The AI generates a ranked JSON output containing match scores, strengths, gaps, and natural language reasoning for every shortlisted candidate.
5.  **Persistence**: Results are saved to the database at the job level for instant retrieval and historical tracking.

## 📝 Assumptions and Limitations

### Assumptions
- **Resume Quality**: The system assumes candidates have provided comprehensive data in their profiles.
- **Language**: Current prompts are optimized for English-language resumes and job descriptions.
- **Recruiter Ownership**: The system assumes a 1-to-N relationship where a recruiter owns specific jobs and can only see results for those jobs.

### Limitations
- **Token Limits**: Processing more than 50-100 candidates in a single AI call may exceed context window limits of some smaller models (mitigated by fallback logic).
- **Processing Time**: AI analysis can take 10-60 seconds depending on the number of candidates and the active model.
- **Data Privacy**: Personal identifying information is sent to the Gemini API for analysis; users should ensure compliance with their local data protection regulations.
