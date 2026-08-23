from app.rag.vector_store import search_chunks
from app.rag.generator import generate_answer


def answer_question(
    question: str,
    user_id: int,
    top_k: int = 5,
):
    # 1. Retrieve relevant evidence from Qdrant.
    # Qdrant Cloud handles query embedding.
    results = search_chunks(
        query=question,
        user_id=user_id,
        top_k=top_k,
    )

    # 2. Extract document text and metadata.
    documents = [
        result.payload.get("text", "")
        for result in results
        if result.payload
    ]

    metadatas = [
        {
            key: value
            for key, value in result.payload.items()
            if key != "text"
        }
        for result in results
        if result.payload
    ]

    # 3. Generate grounded answer.
    answer = generate_answer(
        question=question,
        retrieved_documents=documents,
        retrieved_metadata=metadatas,
    )

    return {
        "question": question,
        "answer": answer,
        "sources": metadatas,
    }