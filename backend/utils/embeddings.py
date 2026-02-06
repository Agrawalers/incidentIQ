from sentence_transformers import SentenceTransformer

# Load model once (cached after first load)
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str) -> list:
    """
    Generate embeddings using sentence-transformers
    """
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()
