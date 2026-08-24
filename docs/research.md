# NEXUS Research & Design

## 1. Problem Statement

Modern researchers often need to analyze multiple papers and large technical documents before they can answer a focused research question.

Traditional document search can locate keywords, but it does not necessarily understand the semantic meaning of a question. General-purpose LLMs can produce fluent answers, but may introduce unsupported claims or fail to provide reliable traceability to source material.

NEXUS addresses this problem by combining semantic retrieval with a multi-agent reasoning workflow designed around evidence.

---

## 2. Objective

The primary objective of NEXUS is to provide an evidence-grounded research assistant that can:

- Understand research-oriented questions
- Search uploaded research documents semantically
- Retrieve relevant evidence
- Determine whether evidence supports generated claims
- Produce concise research answers
- Preserve document and page-level source information

The system is designed to reduce unsupported generation and improve the traceability of research answers.

---

## 3. Core Approach

NEXUS follows a Retrieval-Augmented Generation architecture enhanced with multiple specialized agents.

The core workflow is:

```text
                 USER QUESTION
                       │
                       ▼
                ┌─────────────┐
                │   PLANNER   │
                │    AGENT    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  RETRIEVAL  │
                │    AGENT    │
                └──────┬──────┘
                       │
                       ▼
                   EVIDENCE
                       │
                       ▼
                ┌─────────────┐
                │VERIFICATION │
                │    AGENT    │
                └──────┬──────┘
                       │
                       ▼
                VERIFIED CLAIMS
                       │
                       ▼
                ┌─────────────┐
                │  SYNTHESIS  │
                │    AGENT    │
                └──────┬──────┘
                       │
                       ▼
             FINAL ANSWER + SOURCES
```

---

## 4. Document Processing

When a research paper is uploaded, NEXUS processes the document before it can be used for semantic research.

### Processing stages

```text
PDF
 │
 ▼
Text Extraction
 │
 ▼
Chunking
 │
 ▼
Embedding
 │
 ▼
Vector Storage
```

Each chunk is associated with metadata such as:

- User ID
- Document ID
- Page number
- Chunk index
- Original text

This allows retrieved evidence to remain traceable to its source.

---

## 5. Query Planning

The Planner Agent determines how a user query should be handled.

The supported query categories are:

### Document QA

Questions about information contained in uploaded documents.

### Paper Comparison

Questions that compare multiple papers, methods, datasets, architectures, or results.

### Research Analysis

Broader research questions involving trends, gaps, methodologies, emerging themes, or literature analysis.

### General

Questions that do not require document or research retrieval.

The planner also determines whether retrieval is required and whether multiple sources are needed.

---

## 6. Semantic Retrieval

Keyword search can miss relevant information when the wording of the query differs from the wording in the source document.

NEXUS therefore uses semantic vector retrieval.

Research documents are divided into chunks and represented in vector space. A user query is then compared against these representations to identify semantically relevant evidence.

Qdrant is used as the vector database.

Retrieval is additionally filtered by authenticated user ID to maintain document isolation.

---

## 7. Evidence Verification

One of the central design goals of NEXUS is to reduce unsupported claims.

The Verification Agent receives:

- The generated answer
- Retrieved evidence

It evaluates factual claims only against the supplied evidence.

Each claim receives one of three statuses:

```text
SUPPORTED
PARTIALLY_SUPPORTED
UNSUPPORTED
```

### Supported

The supplied evidence clearly supports the claim.

### Partially Supported

The evidence supports only part of the claim, or the generated statement is stronger than the evidence.

### Unsupported

The supplied evidence does not support the claim.

The verifier is instructed not to use outside knowledge or invent supporting sources.

---

## 8. Evidence-Grounded Synthesis

After verification, the Synthesis Agent produces the final answer.

The synthesis stage:

1. Excludes unsupported claims.
2. Preserves supported claims.
3. Treats partially supported claims cautiously.
4. Uses only the verified evidence.
5. Provides source/page references where applicable.
6. Explicitly indicates when available evidence is insufficient.

This creates a separation between **generation** and **verification**, rather than relying on a single unconstrained LLM response.

---

## 9. Multi-Agent Design

NEXUS separates the research workflow into specialized agents.

| Agent | Responsibility |
|---|---|
| Planner Agent | Classifies and plans the query |
| Retrieval Agent | Retrieves relevant document evidence |
| Verification Agent | Checks claims against evidence |
| Synthesis Agent | Produces the final grounded answer |

This modular design allows individual agents to be improved independently.

---

## 10. Technology Choices

### FastAPI

FastAPI provides the backend API and integrates naturally with Python-based document processing and AI workflows.

### PostgreSQL

PostgreSQL stores structured application data such as users, documents, research sessions, and messages.

### Qdrant

Qdrant provides vector storage and semantic retrieval for document chunks.

### OpenRouter

OpenRouter provides access to the language models used by the planner, verification, and synthesis stages.

### React + Vite

React and Vite provide the interactive research interface.

### Vercel and Render

The frontend and backend are deployed separately to provide a simple production architecture.

---

## 11. Security and Isolation

NEXUS uses authentication and user-scoped retrieval to protect user data.

Key mechanisms include:

- JWT authentication
- Password hashing
- CORS configuration
- Environment-based secrets
- User ID filtering during vector retrieval
- Database-backed user isolation

A vector search is performed with the authenticated user's ID so that documents belonging to another user are not returned.

---

## 12. Design Rationale

The architecture intentionally separates the stages of research processing.

A direct approach could be:

```text
Question → LLM → Answer
```

NEXUS instead uses:

```text
Question
   ↓
Plan
   ↓
Retrieve Evidence
   ↓
Verify Claims
   ↓
Synthesize
   ↓
Answer + Sources
```

This provides several advantages:

- Better traceability
- Explicit evidence handling
- Reduced reliance on unsupported model knowledge
- Modular reasoning components
- Easier debugging
- Clearer separation of responsibilities

---

## 13. Limitations

The current system has several limitations:

- Retrieval quality depends on document chunking and semantic similarity.
- The quality of verification depends on the retrieved evidence.
- Very large research collections may require more advanced indexing strategies.
- LLM-generated explanations can still contain errors.
- The current system primarily works with uploaded documents rather than automatically discovering new literature from external academic databases.
- Long-document reasoning can be improved further with hierarchical retrieval and summarization.

---

## 14. Future Scope

Potential future improvements include:

### Advanced Retrieval

- Hybrid keyword + vector retrieval
- Re-ranking models
- Query expansion
- Hierarchical document retrieval

### Research Intelligence

- Automatic literature review generation
- Research gap detection
- Methodology comparison
- Citation network analysis
- Research trend visualization

### Agent Improvements

- Specialized domain agents
- Dynamic agent routing
- Confidence scoring
- Multi-step research planning

### User Experience

- Streaming answers
- Rich citation interfaces
- Document comparison views
- Exportable research reports
- Research session history

---

## 15. Conclusion

NEXUS demonstrates how a multi-agent architecture can be combined with Retrieval-Augmented Generation to create an evidence-grounded research assistant.

The system separates query planning, semantic retrieval, claim verification, and final synthesis into distinct stages.

The resulting workflow is designed to make research answers more traceable, evidence-aware, and useful than a direct question-to-LLM interaction.

**Core principle:**

> Plan → Retrieve → Verify → Synthesize
