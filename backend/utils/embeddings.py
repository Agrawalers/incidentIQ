from sentence_transformers import SentenceTransformer

# Load once (global, fast)
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str) -> list:
    """
    Generate local embeddings (no API, no quota)
    """
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()
