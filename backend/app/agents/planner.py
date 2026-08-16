from enum import Enum

from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field


class QueryType(str, Enum):
    DOCUMENT_QA = "document_qa"
    PAPER_COMPARISON = "paper_comparison"
    RESEARCH_ANALYSIS = "research_analysis"
    GENERAL = "general"


class QueryPlan(BaseModel):
    query_type: QueryType = Field(
        description="The type of research query"
    )

    requires_retrieval: bool = Field(
        description="Whether document or paper retrieval is required"
    )

    requires_multiple_sources: bool = Field(
        description="Whether multiple sources are needed"
    )

    reasoning: str = Field(
        description="Brief explanation of why this query type was selected"
    )


llm = ChatOllama(
    model="llama3.2",
    temperature=0,
)


planner = llm.with_structured_output(QueryPlan)


def plan_query(query: str) -> QueryPlan:
    prompt = f"""
You are the query planning agent for NEXUS,
a multi-agent research intelligence platform.

Classify the user's query into exactly one category:

DOCUMENT_QA:
Questions about information contained in uploaded documents.

PAPER_COMPARISON:
Requests to compare multiple research papers, methods,
datasets, architectures, or results.

RESEARCH_ANALYSIS:
Requests involving literature surveys, research trends,
research gaps, emerging themes, methodologies across papers,
or broader research analysis.

GENERAL:
Questions that do not require document or research retrieval.

Determine:

1. Query type
2. Whether retrieval is required
3. Whether multiple sources are required
4. Brief reasoning

USER QUERY:

{query}
"""

    return planner.invoke(prompt)