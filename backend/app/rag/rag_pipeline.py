from app.rag.embeddings import generate_embedding
from app.rag.vector_store import search_chunks
from app.rag.generator import generate_answer


def answer_question(
    question: str,
    top_k: int = 5,
):
    # 1. Convert question into an embedding
    query_embedding = generate_embedding(question)

    # 2. Retrieve relevant evidence
    results = search_chunks(
        query_embedding=query_embedding,
        top_k=top_k,
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    # 3. Generate grounded answer
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