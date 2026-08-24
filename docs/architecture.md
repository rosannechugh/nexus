# NEXUS Architecture

NEXUS is a multi-agent research intelligence platform that combines document ingestion, semantic retrieval, query planning, claim verification, and evidence-grounded synthesis.

## High-Level Architecture

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
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │ PostgreSQL   │  │   Qdrant     │  │  OpenRouter  │
          │    Neon      │  │ Vector Store │  │     LLM      │
          └──────────────┘  └──────────────┘  └──────────────┘
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
       └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
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
```

## Research Query Pipeline

```text
User Question
      │
      ▼
Query Planner
      │
      ├── Determines query type
      ├── Determines retrieval requirement
      └── Determines whether multiple sources are required
      │
      ▼
Retrieval Agent
      │
      ├── Generates semantic query
      ├── Searches Qdrant
      └── Retrieves relevant document chunks
      │
      ▼
Evidence
      │
      ▼
Verification Agent
      │
      ├── Extracts factual claims
      ├── Compares claims against evidence
      └── Labels claims as:
          ├── SUPPORTED
          ├── PARTIALLY_SUPPORTED
          └── UNSUPPORTED
      │
      ▼
Synthesis Agent
      │
      ├── Uses verified claims only
      ├── Avoids unsupported information
      └── Generates source references
      │
      ▼
Final Research Answer
```

## Document Ingestion Pipeline

```text
PDF Upload
    │
    ▼
PDF Text Extraction
    │
    ▼
Document Chunking
    │
    ▼
Embedding Generation
    │
    ▼
Qdrant
    │
    ├── Vector
    └── Metadata
         ├── user_id
         ├── document_id
         ├── page_number
         ├── chunk_index
         └── text
```

## Core Components

### Frontend

Built with React and Vite.

Responsibilities:

- User authentication
- Document upload
- Research session management
- Query submission
- Answer rendering
- Evidence/source display

### Backend

Built with FastAPI.

Responsibilities:

- REST API
- Authentication
- Document processing
- Research orchestration
- Agent execution
- Database access
- Vector retrieval

### PostgreSQL

Hosted using Neon.

Stores structured application data such as:

- Users
- Documents
- Research sessions

### Qdrant

Qdrant is used as the vector database for semantic retrieval.

Each document is divided into chunks and stored with:

- Semantic embedding
- User ID
- Document ID
- Page number
- Chunk index
- Original text

User-level filtering ensures that retrieval is restricted to documents belonging to the authenticated user.

### LLM Layer

OpenRouter provides access to the language model used by the research agents.

The LLM is used for:

- Query planning
- Claim verification
- Evidence-grounded synthesis

## Design Principles

### Evidence Grounding

NEXUS generates research answers using retrieved document evidence rather than relying solely on model knowledge.

### Claim Verification

Generated claims are explicitly checked against retrieved evidence before final synthesis.

### User Isolation

Retrieval queries are filtered using the authenticated user's ID to prevent documents from different users from being mixed.

### Modular Agents

Each stage of the research workflow is implemented as a separate agent, allowing individual components to be modified or extended independently.

## Deployment Architecture

```text
GitHub
  │
  ├──────────────► Vercel
  │                 └── React Frontend
  │
  └──────────────► Render
                    └── FastAPI Backend
                         │
                         ├── Neon PostgreSQL
                         ├── Qdrant Cloud
                         └── OpenRouter
```

## Security Considerations

- JWT authentication protects authenticated API routes.
- CORS is configured for the deployed frontend.
- Database credentials and API keys are stored as environment variables.
- `.env` files are excluded from version control.
- Retrieval is scoped to the authenticated user's documents.

## Scalability Considerations

The architecture can be extended with:

- Additional specialized agents
- More advanced retrieval strategies
- Streaming LLM responses
- Citation ranking
- Background document processing
- Additional research workflows

## Summary

NEXUS combines a production web application with a multi-agent RAG pipeline. The system separates planning, retrieval, verification, and synthesis so that research answers can be generated from traceable evidence rather than relying on a single unconstrained LLM response.
