# NEXUS

## Multi-Agent Research Intelligence Platform

> **Research intelligence, built around evidence.**

NEXUS is a multi-agent research intelligence platform designed to help users analyze uploaded research documents through semantic retrieval, query planning, evidence verification, and grounded answer synthesis.

Instead of sending a question directly to an LLM, NEXUS processes research queries through a multi-stage pipeline:

**Plan → Retrieve → Verify → Synthesize**

---

## Features

- 📄 Upload and process research PDFs
- 🔎 Semantic document retrieval
- 🧠 Query planning
- 🤖 Multi-agent research workflow
- ✅ Evidence-based claim verification
- ✍️ Evidence-grounded answer synthesis
- 📚 Source and page references
- 🔐 JWT-based authentication
- 👤 User-specific document isolation
- ☁️ Production deployment

---

## Architecture

NEXUS follows a modular multi-agent Retrieval-Augmented Generation (RAG) architecture.

```text
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │      Frontend        │
                         │       Vercel         │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │       Backend        │
                         │       Render         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Multi-Agent RAG    │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   Planner   │       │  Retrieval  │       │Verification │
       │    Agent    │       │    Agent    │       │    Agent    │
       └─────────────┘       └─────────────┘       └─────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Synthesis Agent    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Answer + Evidence   │
                         │   + Source Pages    │
                         └──────────────────────┘

          ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
          │ PostgreSQL   │     │   Qdrant     │     │  OpenRouter  │
          │    Neon      │     │ Vector Store │     │     LLM      │
          └──────────────┘     └──────────────┘     └──────────────┘
```

For the detailed architecture, see [`docs/architecture.md`](docs/architecture.md).

---

## Research Workflow

### 1. Document Ingestion

Users upload research papers as PDF documents.

NEXUS:

1. Extracts text from the PDF.
2. Splits the document into searchable chunks.
3. Generates vector representations.
4. Stores vectors and metadata in Qdrant.

Each chunk retains metadata such as:

- User ID
- Document ID
- Page number
- Chunk index
- Original text

### 2. Query Planning

The Planner Agent classifies the user's question into one of four categories:

- `DOCUMENT_QA`
- `PAPER_COMPARISON`
- `RESEARCH_ANALYSIS`
- `GENERAL`

It also determines:

- Whether retrieval is required.
- Whether multiple sources are required.
- Why the selected query type is appropriate.

### 3. Retrieval

The Retrieval Agent searches Qdrant for semantically relevant document chunks.

Retrieved evidence is associated with document and page metadata so that the final response can be traced back to its source.

### 4. Verification

The Verification Agent evaluates factual claims against the supplied evidence.

Each claim is classified as:

- `SUPPORTED`
- `PARTIALLY_SUPPORTED`
- `UNSUPPORTED`

The verifier is instructed to use only the supplied evidence and not outside knowledge.

### 5. Synthesis

The Synthesis Agent creates the final research answer using verified claims and their supporting evidence.

Unsupported claims are excluded from the final response.

The final answer can reference evidence using source and page information.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Vector Database | Qdrant Cloud |
| LLM Gateway | OpenRouter |
| PDF Processing | pypdf |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Authentication | JWT |
| Deployment | Vercel + Render |
| Version Control | Git + GitHub |

---

## Project Structure

```text
nexus/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── rag/
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   └── frontend/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── docs/
│   ├── api.md
│   ├── architecture.md
│   └── research.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Python 3.11+
- Node.js 18+
- npm
- Git

You also need accounts/configuration for:

- Neon PostgreSQL
- Qdrant Cloud
- OpenRouter

### 1. Clone the repository

```bash
git clone https://github.com/rosannechugh/nexus.git
cd nexus
```

### 2. Backend Setup

```bash
cd backend
python -m venv testenv
```

#### Windows PowerShell

```powershell
.	testenv\Scripts\Activate.ps1
```

#### macOS / Linux

```bash
source testenv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

```text
.env
```

Use `.env.example` as the template.

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend/frontend
npm install
npm run dev
```

The development frontend will normally be available at:

```text
http://localhost:5173
```

---

## Environment Variables

The backend requires environment variables for the database, authentication, CORS, vector database, and LLM provider.

Example:

```env
DATABASE_URL=

JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=http://localhost:5173

QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION=nexus_documents

OPENROUTER_API_KEY=
```

Do **not** commit real credentials or API keys.

The `.env` file is intentionally excluded from version control.

---

## API

The main API groups include:

```text
/api/auth
/api/documents
/api/chat
/api/research
```

Interactive API documentation is available through FastAPI Swagger UI at:

```text
/docs
```

More details are available in [`docs/api.md`](docs/api.md).

---
## Production Deployment

The deployed NEXUS architecture uses:

```text
                    GitHub
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          Vercel               Render
       React Frontend       FastAPI Backend
                                 │
                   ┌─────────────┼─────────────┐
                   ▼             ▼             ▼
                 Neon         Qdrant       OpenRouter
              PostgreSQL     Vector DB          LLM
```

### Production URLs

**Frontend**

https://nexus-two-bay-53.vercel.app/

**Backend**

https://nexus-backend-6mez.onrender.com/

**API Documentation**

https://nexus-backend-6mez.onrender.com/docs

---

## Security

NEXUS uses several mechanisms to protect the application:

- JWT-based authentication
- Password hashing
- CORS restrictions
- Environment-based secret management
- User-scoped document retrieval
- Database-backed user isolation
- `.env` exclusion through `.gitignore`

Never place production API keys, JWT secrets, database credentials, or other secrets in source control.

---

## Design Principles

### Evidence Grounding

Research answers are generated from retrieved evidence rather than relying exclusively on model knowledge.

### Claim Verification

Claims are evaluated against retrieved evidence before final synthesis.

### Traceability

Retrieved evidence retains document, page, and chunk metadata, allowing answers to be traced back to source material.

### Modular Agents

Planning, retrieval, verification, and synthesis are separated into independent components.

### User Isolation

Retrieval is scoped to the authenticated user so that one user's documents are not exposed to another user.

---

## Future Scope

Potential extensions include:

- Multi-document comparison interfaces
- Citation ranking and confidence scoring
- Streaming research responses
- Additional specialized research agents
- Knowledge graph integration
- Advanced paper metadata extraction
- Improved long-document reasoning
- Automated literature review generation
- Background document processing
- Research session export

---

## Project Status

**Status: Production Demo Ready**

NEXUS currently supports:

- User registration and authentication
- Research PDF upload
- PDF text extraction
- Document chunking and indexing
- Semantic vector retrieval
- Multi-agent query processing
- Evidence verification
- Grounded answer synthesis
- Source/page visualization
- Production deployment

---

## Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Research & Design](docs/research.md)

---

## Demo

Live application:

**https://nexus-two-bay-53.vercel.app/**

The application demonstrates the complete workflow:

**Upload → Plan → Retrieve → Verify → Synthesize → Cite**

---

## License

This project was developed as a capstone project.
