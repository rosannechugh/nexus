from app.agents.retrieval_agent import retrieve_evidence
from app.agents.verification_agent import verify_claims


if __name__ == "__main__":

    question = input("Research question: ")

    evidence_objects = retrieve_evidence(
        query=question,
        top_k=5,
    )

    evidence = [
        item.model_dump()
        for item in evidence_objects
    ]

    answer = input("\nPaste the generated answer:\n")

    result = verify_claims(
        answer=answer,
        evidence=evidence,
    )

    print("\n" + "=" * 70)
    print("NEXUS VERIFICATION")
    print("=" * 70)

    for claim in result.claims:

        print("\nCLAIM:")
        print(claim.claim)

        print("\nSTATUS:")
        print(claim.status)

        print("\nSUPPORTING SOURCES:")
        print(claim.supporting_sources)

        print("\nEXPLANATION:")
        print(claim.explanation)