from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """
    Generate a vector embedding for a piece of text.
    """

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for multiple pieces of text.
    """

    embeddings = model.encode(
        texts,
        convert_to_numpy=True
    )

    return embeddings.tolist()