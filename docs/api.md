# NEXUS API Documentation

NEXUS exposes a REST API built with FastAPI for authentication, document management, research workflows, and chat.

## Base URL

### Local

```text
http://127.0.0.1:8000
```

### Production

```text
https://nexus-backend-6mez.onrender.com
```

Interactive Swagger documentation is available at:

```text
https://nexus-backend-6mez.onrender.com/docs
```

---

## Authentication

NEXUS uses JWT bearer authentication for protected endpoints.

### Register

**Endpoint**

```http
POST /api/auth/register
```

Creates a new NEXUS user account.

### Login

**Endpoint**

```http
POST /api/auth/login
```

Authenticates a user and returns an access token.

The returned token is used for protected requests:

```http
Authorization: Bearer <access_token>
```

---

## Documents

The document API manages uploaded research papers and their processing.

### Upload Document

```http
POST /api/documents/upload
```

Uploads a PDF associated with the authenticated user.

The document is processed and its contents can subsequently be indexed for semantic retrieval.

### Document Retrieval

Document endpoints can be used to retrieve document information belonging to the authenticated user.

All document operations are scoped to the authenticated user.

---

## Research

Research endpoints manage research-oriented workflows and sessions.

### Research Query

```http
POST /api/research/...
```

Research requests are processed through the NEXUS multi-agent pipeline.

The workflow can include:

1. Query planning
2. Semantic retrieval
3. Evidence collection
4. Claim verification
5. Answer synthesis

The exact request and response schemas are available in the live Swagger documentation.

---

## Chat

Chat endpoints provide question-answering functionality over indexed user documents.

### Chat Query

```http
POST /api/chat/...
```

A user submits a research question, which is processed against relevant indexed evidence.

The response may contain:

- User question
- Generated answer
- Retrieved sources
- Document metadata
- Page references

The exact schema is available through Swagger UI.

---

## RAG Pipeline

NEXUS uses Retrieval-Augmented Generation to ground answers in uploaded research documents.

```text
User Question
      │
      ▼
Query Planning
      │
      ▼
Semantic Retrieval
      │
      ▼
Qdrant Evidence
      │
      ▼
Claim Verification
      │
      ▼
Answer Synthesis
      │
      ▼
Answer + Sources
```

### Retrieval Metadata

Retrieved chunks retain metadata including:

```text
user_id
document_id
page_number
chunk_index
text
```

This metadata allows generated answers to be traced back to the original document and page.

---

## Error Responses

The API uses standard HTTP status codes.

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `400` | Invalid request |
| `401` | Authentication required or credentials invalid |
| `403` | Access denied |
| `404` | Resource not found |
| `422` | Request validation failed |
| `500` | Internal server error |

FastAPI validation errors generally return a structured JSON response describing the invalid fields.

---

## Security

Protected endpoints require a valid JWT.

User-scoped operations ensure that authenticated users can access only their own documents and associated research data.

Sensitive configuration is supplied through environment variables rather than hardcoded in the application.

---

## Interactive API Documentation

For the complete automatically generated API specification, use:

```text
https://nexus-backend-6mez.onrender.com/docs
```

FastAPI also exposes the OpenAPI schema at:

```text
https://nexus-backend-6mez.onrender.com/openapi.json
```

The Swagger interface should be treated as the authoritative reference for the exact request and response schemas.
