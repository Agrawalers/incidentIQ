import json
import faiss
import numpy as np
from pathlib import Path

from backend.utils.embeddings import get_embedding

# ---------------- Paths ----------------

BASE_DIR = Path(__file__).resolve().parent
INDEX_PATH = BASE_DIR / "index.faiss"
META_PATH = BASE_DIR / "index_meta.json"

# ---------------- Load FAISS index ----------------

index = faiss.read_index(str(INDEX_PATH))

with open(META_PATH, "r") as f:
    metadata = json.load(f)

# ---------------- Retriever ----------------

def retrieve_similar_incidents(query: str, top_k: int = 3):
    """
    Retrieve top-K UNIQUE similar incidents for a given query
    """

    query_vector = np.array(
        [get_embedding(query)],
        dtype="float32"
    )

    # Search more than needed to allow deduplication
    distances, indices = index.search(query_vector, top_k * 2)

    seen_ids = set()
    results = []

    for idx, dist in zip(indices[0], distances[0]):
        incident = metadata[idx]

        if incident["id"] in seen_ids:
            continue

        seen_ids.add(incident["id"])

        incident_copy = incident.copy()
        incident_copy["similarity_score"] = float(1 / (1 + dist))
        results.append(incident_copy)

        if len(results) == top_k:
            break

    return results
