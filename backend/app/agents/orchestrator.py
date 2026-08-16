from app.agents.planner import plan_query
from app.agents.retrieval_agent import retrieve_evidence
from app.agents.verification_agent import verify_claims
from app.agents.synthesis_agent import synthesize_answer
from app.rag.generator import generate_answer


def execute_query(
        query: str, 
        user_id: int,
        top_k: int = 5):

    # --------------------------------
    # 1. PLAN
    # --------------------------------

    plan = plan_query(query)

    # --------------------------------
    # 2. RETRIEVE
    # --------------------------------

    evidence_objects = []

    if plan.requires_retrieval:
        evidence_objects = retrieve_evidence(
            query=query,
            user_id=user_id,
            top_k=top_k,
        )

    evidence = [
        item.model_dump()
        for item in evidence_objects
    ]

    # --------------------------------
    # 3. GENERATE
    # --------------------------------

    if evidence:

        documents = [
            item["content"]
            for item in evidence
        ]

        metadata = [
            {
                "page_number": item["page_number"],
                "chunk_index": item["chunk_index"],
            }
            for item in evidence
        ]

        generated_answer = generate_answer(
            question=query,
            retrieved_documents=documents,
            retrieved_metadata=metadata,
        )

    else:
        generated_answer = (
            "I don't have enough information in the "
            "available knowledge base to answer this question."
        )

    # --------------------------------
    # 4. VERIFY
    # --------------------------------

    verification = verify_claims(
        answer=generated_answer,
        evidence=evidence,
    )

    verified_claims = [
        claim.model_dump()
        for claim in verification.claims
    ]

    # --------------------------------
    # 5. SYNTHESIZE
    # --------------------------------

    final_answer = synthesize_answer(
        question=query,
        verified_claims=verified_claims,
        evidence=evidence,
    )

    # --------------------------------
    # 6. RETURN STRUCTURED RESULT
    # --------------------------------

    return {
        "query": query,
        "query_type": plan.query_type.value,
        "reasoning": plan.reasoning,
        "answer": final_answer,
        "sources": evidence,
        "verification": verified_claims,
    }