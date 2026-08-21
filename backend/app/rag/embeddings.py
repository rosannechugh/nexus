MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def get_model():
    """
    Load the embedding model only when it is actually needed.
    """

    global _model

    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(MODEL_NAME)

    return _model


def generate_embedding(text: str) -> list[float]:
    """
    Generate a vector embedding for a piece of text.
    """

    model = get_model()

    embedding = model.encode(
        text,
        convert_to_numpy=True,
    )

    return embedding.tolist()


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple pieces of text.
    """

    model = get_model()

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
    )

    return embeddings.tolist()