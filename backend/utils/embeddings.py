from sentence_transformers import SentenceTransformer

model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    return model

def get_embedding(text: str) -> list:
    """
    Generate embeddings using sentence-transformers
    """
    m = get_model()
    embedding = m.encode(text, normalize_embeddings=True)
    return embedding.tolist()
