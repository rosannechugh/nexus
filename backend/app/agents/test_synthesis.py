from app.agents.retrieval_agent import retrieve_evidence
from app.agents.verification_agent import verify_claims
from app.agents.synthesis_agent import synthesize_answer


if __name__ == "__main__":

    question = input("Research question: ")

    # Retrieve evidence
    evidence_objects = retrieve_evidence(
        query=question,
        top_k=5,
    )

    evidence = [
        item.model_dump()
        for item in evidence_objects
    ]

    # Temporary generated answer
    answer = input("\nPaste the generated answer:\n")

    # Verify claims
    verification = verify_claims(
        answer=answer,
        evidence=evidence,
    )

    verified_claims = [
        claim.model_dump()
        for claim in verification.claims
    ]

    # Synthesize final answer
    final_answer = synthesize_answer(
        question=question,
        verified_claims=verified_claims,
        evidence=evidence,
    )

    print("\n" + "=" * 70)
    print("NEXUS FINAL ANSWER")
    print("=" * 70)

    print("\n")
    print(final_answer)